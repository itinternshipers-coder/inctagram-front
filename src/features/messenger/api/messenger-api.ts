import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { acquireMessengerSocket, releaseMessengerSocket } from '@/features/messenger/lib/messenger-socket'
import { profileApi } from '@/features/profile/api/profile-api'
import {
  ChatItem,
  GetChatsRequest,
  GetChatsResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  MESSENGER_LIMITS,
  MESSENGER_WS_EVENTS,
  Message,
  SendMessageAck,
  SendMessageRequest,
  UploadMessengerImageRequest,
  UploadMessengerImageResponse,
  UploadMessengerVoiceRequest,
  UploadMessengerVoiceResponse,
} from '@/features/messenger/model/types'
import type { AppDispatch, RootState } from '@/store/store'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const WS_ACK_TIMEOUT_MS = 10_000
const EMPTY_MESSAGES_RESPONSE: GetMessagesResponse = { items: [], nextCursor: null, hasMore: false }

const upsertChatPreview = (items: ChatItem[], chat: ChatItem) => {
  const existingIndex = items.findIndex((item) => item.id === chat.id)

  if (existingIndex >= 0) {
    const existing = items[existingIndex]

    items.splice(existingIndex, 1)
    items.unshift({
      ...existing,
      ...chat,
      participant: {
        ...existing.participant,
        ...chat.participant,
      },
      unreadCount: chat.unreadCount,
    })

    return
  }

  items.unshift(chat)
}

const buildFallbackChat = (senderId: string, message: Message): ChatItem => ({
  id: senderId,
  participant: {
    userId: senderId,
    username: senderId,
    avatarUrl: null,
  },
  lastMessage: message,
  unreadCount: 1,
  updatedAt: message.createdAt,
})

const mergeMessages = (items: Message[], incoming: Message): Message[] => {
  if (incoming.clientMessageId) {
    const optimisticIndex = items.findIndex((item) => item.clientMessageId === incoming.clientMessageId)

    if (optimisticIndex >= 0) {
      const nextItems = items.slice()

      nextItems[optimisticIndex] = { ...incoming, status: 'sent' }

      return nextItems
    }
  }

  if (items.some((item) => item.id === incoming.id)) {
    return items
  }

  return [incoming, ...items]
}

const resolveIncomingChat = async (dispatch: AppDispatch, senderId: string, message: Message): Promise<ChatItem> => {
  const profileRequest = dispatch(profileApi.endpoints.getProfile.initiate(senderId))

  try {
    const profile = await profileRequest.unwrap()

    return {
      id: senderId,
      participant: {
        userId: profile.userId,
        username: profile.username,
        avatarUrl: profile.avatar?.[0]?.url ?? null,
      },
      lastMessage: message,
      unreadCount: 1,
      updatedAt: message.createdAt,
    }
  } catch {
    return buildFallbackChat(senderId, message)
  } finally {
    profileRequest.unsubscribe()
  }
}

const unauthorizedError = (): FetchBaseQueryError => ({
  status: 'CUSTOM_ERROR',
  error: 'No access token in store — cannot open messenger WS',
  data: undefined,
})

const wsError = (error: string): FetchBaseQueryError => ({
  status: 'CUSTOM_ERROR',
  error,
  data: undefined,
})

function emitWithAck<TPayload, TResponse>(
  event: string,
  payload: TPayload,
  token: string,
  timeoutMs = WS_ACK_TIMEOUT_MS
): Promise<TResponse> {
  const socket = acquireMessengerSocket(token)
  return new Promise<TResponse>((resolve, reject) => {
    const timer = setTimeout(() => {
      releaseMessengerSocket()
      reject(new Error(`${event} ack timeout (${timeoutMs}ms)`))
    }, timeoutMs)

    socket.emit(event, payload, (response: TResponse) => {
      clearTimeout(timer)
      releaseMessengerSocket()
      resolve(response)
    })
  })
}

export const messengerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Список чатов. На стороне бэка ручки для списка нет.
    // Возвращаем пустой объект синхронно — кеш наполняется из live newMessage через
    // onCacheEntryAdded. Когда у бэка появится эндпоинт — заменим queryFn
    // на эмит/REST в одной точке, остальная инфраструктура останется.
    getChats: build.query<GetChatsResponse, GetChatsRequest | void>({
      queryFn: () => ({ data: { items: [], nextCursor: null, hasMore: false } }),
      providesTags: ['Chats'],

      async onCacheEntryAdded(
        _arg,
        { getState, dispatch: rawDispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const token = (getState() as RootState).auth.accessToken
        if (!token) return
        const dispatch = rawDispatch as AppDispatch

        const socket = acquireMessengerSocket(token)

        try {
          await cacheDataLoaded

          // В Message нет chatId — диалоги идентифицируются парой userId.
          // Ищем чат собеседника по msg.senderId (входящее всегда от
          // собеседника; отправителю newMessage не шлётся.
          // Чат в кеше не наполняется автоматически — этим занимается код, который сам
          // обновляет кеш через util.upsertQueryData при отправке
          // первого сообщения новому получателю.
          const onMessageNew = async (msg: Message) => {
            const state = getState() as RootState
            const existingMessages =
              messengerApi.endpoints.getMessages.select({ recipientId: msg.senderId })(state).data?.items ?? []

            dispatch(
              messengerApi.util.upsertQueryData(
                'getMessages',
                { recipientId: msg.senderId },
                { ...EMPTY_MESSAGES_RESPONSE, items: mergeMessages(existingMessages, msg) }
              )
            )

            let needsBootstrap = false

            updateCachedData((draft) => {
              const idx = draft.items.findIndex((c) => c.id === msg.senderId)
              if (idx === -1) {
                needsBootstrap = true
                return
              }
              const [chat] = draft.items.splice(idx, 1)
              chat.lastMessage = msg
              chat.updatedAt = msg.createdAt
              chat.unreadCount += 1
              draft.items.unshift(chat)
            })

            if (!needsBootstrap) {
              return
            }

            const chat = await resolveIncomingChat(dispatch, msg.senderId, msg)

            updateCachedData((draft) => {
              upsertChatPreview(draft.items, chat)
            })
          }

          socket.on(MESSENGER_WS_EVENTS.MESSAGE_NEW, onMessageNew)

          await cacheEntryRemoved
          socket.off(MESSENGER_WS_EVENTS.MESSAGE_NEW, onMessageNew)
        } finally {
          releaseMessengerSocket()
        }
      },
    }),

    // История сообщений одной переписки. Идентифицируется по recipientId
    // (у бэка нет понятия chatId). История на бэке тоже пока не
    // реализована — возвращаем пустой объект, дальше кеш наполняется
    // из оптимистичных sendMessage и live newMessage через
    // onCacheEntryAdded.
    getMessages: build.query<GetMessagesResponse, GetMessagesRequest>({
      queryFn: () => ({ data: { items: [], nextCursor: null, hasMore: false } }),
      // Кеш на recipientId — все сообщения этой переписки в одном кеше.
      serializeQueryArgs: ({ queryArgs }) => ({ recipientId: queryArgs.recipientId }),
      providesTags: (_result, _error, { recipientId }) => [{ type: 'Messages', id: recipientId }],

      async onCacheEntryAdded({ recipientId }, { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const token = (getState() as RootState).auth.accessToken
        if (!token) return

        const socket = acquireMessengerSocket(token)

        try {
          await cacheDataLoaded

          // Включаем сообщения этой переписки: входящие от собеседника
          // (senderId === recipientId) и эхо своих исходящих (recipientId в payload совпадает).
          // Дедуп — по id и clientMessageId.
          const onMessageNew = (msg: Message) => {
            const belongs = msg.senderId === recipientId || msg.recipientId === recipientId
            if (!belongs) return
            updateCachedData((draft) => {
              if (msg.clientMessageId) {
                const optimisticIdx = draft.items.findIndex((m) => m.clientMessageId === msg.clientMessageId)
                if (optimisticIdx >= 0) {
                  draft.items[optimisticIdx] = { ...msg, status: 'sent' }
                  return
                }
              }
              if (draft.items.some((m) => m.id === msg.id)) return
              draft.items.unshift(msg)
            })
          }

          socket.on(MESSENGER_WS_EVENTS.MESSAGE_NEW, onMessageNew)

          await cacheEntryRemoved
          socket.off(MESSENGER_WS_EVENTS.MESSAGE_NEW, onMessageNew)
        } finally {
          releaseMessengerSocket()
        }
      },
    }),

    // Отправка сообщения. event 'sendMessage' + payload { recipientId, content?, imageUrl?, voiceUrl?, clientMessageId }.
    // Должно быть хотя бы одно из content/imageUrl/voiceUrl,
    // content не длиннее MESSENGER_LIMITS.CONTENT_MAX_LENGTH (500) — оба правила
    // проверяет UI до вызова (UC-1: блокировка кнопки на пустоте/превышении).
    //
    // Оптимизм: pending в getMessages({ recipientId }), после ack.ok —
    // подмена по clientMessageId через ack.data, после ack !ok — failed,
    // после catch — undo.
    sendMessage: build.mutation<Message, SendMessageRequest>({
      async queryFn(arg, { getState, dispatch: rawDispatch }) {
        const dispatch = rawDispatch as AppDispatch
        const token = (getState() as RootState).auth.accessToken
        if (!token) return { error: unauthorizedError() }

        const currentUserId = arg.currentUserId ?? 'self'

        const optimisticMessage: Message = {
          id: arg.clientMessageId,
          senderId: currentUserId,
          recipientId: arg.recipientId,
          content: arg.content ?? null,
          imageUrl: arg.imageUrl ?? null,
          voiceUrl: arg.voiceUrl ?? null,
          clientMessageId: arg.clientMessageId,
          createdAt: new Date().toISOString(),
          status: 'pending',
        }

        const messagesPatch = dispatch(
          messengerApi.util.updateQueryData('getMessages', { recipientId: arg.recipientId }, (draft) => {
            draft.items.unshift(optimisticMessage)
          })
        )

        dispatch(
          messengerApi.util.updateQueryData('getChats', undefined, (draft) => {
            const existingChat = draft.items.find((item) => item.id === arg.recipientId)

            if (existingChat) {
              upsertChatPreview(draft.items, {
                ...existingChat,
                lastMessage: optimisticMessage,
                updatedAt: optimisticMessage.createdAt,
                unreadCount: 0,
              })
            }
          })
        )

        try {
          const { currentUserId: _currentUserId, ...payload } = arg
          const ack = await emitWithAck<SendMessageRequest, SendMessageAck>(
            MESSENGER_WS_EVENTS.MESSAGE_SEND,
            payload,
            token
          )

          if (!ack.ok || !ack.data) {
            dispatch(
              messengerApi.util.updateQueryData('getMessages', { recipientId: arg.recipientId }, (draft) => {
                const item = draft.items.find((m) => m.clientMessageId === arg.clientMessageId)
                if (item) item.status = 'failed'
              })
            )
            const reason = ack.code ? `${ack.code}: ${ack.message ?? ''}` : ack.message
            return { error: wsError(reason || 'sendMessage rejected by server') }
          }

          const realMessage: Message = { ...ack.data, status: 'sent' }

          dispatch(
            messengerApi.util.updateQueryData('getMessages', { recipientId: arg.recipientId }, (draft) => {
              const idx = draft.items.findIndex((m) => m.clientMessageId === arg.clientMessageId)
              if (idx >= 0) {
                draft.items[idx] = realMessage
              } else if (!draft.items.some((m) => m.id === realMessage.id)) {
                draft.items.unshift(realMessage)
              }
            })
          )

          dispatch(
            messengerApi.util.updateQueryData('getChats', undefined, (draft) => {
              const existingChat = draft.items.find((item) => item.id === arg.recipientId)

              if (existingChat) {
                upsertChatPreview(draft.items, {
                  ...existingChat,
                  lastMessage: realMessage,
                  updatedAt: realMessage.createdAt,
                  unreadCount: 0,
                })
              }
            })
          )

          return { data: realMessage }
        } catch (e) {
          messagesPatch.undo()
          return { error: wsError((e as Error).message) }
        }
      },
    }),

    uploadMessengerImage: build.mutation<UploadMessengerImageResponse, UploadMessengerImageRequest>({
      queryFn: async (file, _api, _extra, baseQuery) => {
        if (file.size > MESSENGER_LIMITS.IMAGE_MAX_BYTES) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: `Image exceeds ${MESSENGER_LIMITS.IMAGE_MAX_BYTES} bytes`,
              data: undefined,
            } satisfies FetchBaseQueryError,
          }
        }
        if (!file.type.startsWith('image/')) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'File is not an image',
              data: undefined,
            } satisfies FetchBaseQueryError,
          }
        }

        const formData = new FormData()
        formData.append('image', file)

        const response = await baseQuery({
          url: API_ENDPOINTS.MESSENGER.IMAGE,
          method: 'POST',
          body: formData,
        })

        if (response.error) return { error: response.error as FetchBaseQueryError }
        return { data: response.data as UploadMessengerImageResponse }
      },
    }),

    uploadMessengerVoice: build.mutation<UploadMessengerVoiceResponse, UploadMessengerVoiceRequest>({
      queryFn: async ({ file, durationSec }, _api, _extra, baseQuery) => {
        if (file.size > MESSENGER_LIMITS.VOICE_MAX_BYTES) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: `Voice exceeds ${MESSENGER_LIMITS.VOICE_MAX_BYTES} bytes`,
              data: undefined,
            } satisfies FetchBaseQueryError,
          }
        }
        if (durationSec > MESSENGER_LIMITS.VOICE_MAX_DURATION_SEC) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: `Voice exceeds ${MESSENGER_LIMITS.VOICE_MAX_DURATION_SEC}s`,
              data: undefined,
            } satisfies FetchBaseQueryError,
          }
        }

        const formData = new FormData()
        formData.append('audio', file)

        const response = await baseQuery({
          url: API_ENDPOINTS.MESSENGER.VOICE,
          method: 'POST',
          body: formData,
        })

        if (response.error) return { error: response.error as FetchBaseQueryError }
        return { data: response.data as UploadMessengerVoiceResponse }
      },
    }),
  }),
})

export const {
  useGetChatsQuery,
  useLazyGetChatsQuery,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useUploadMessengerImageMutation,
  useUploadMessengerVoiceMutation,
} = messengerApi
