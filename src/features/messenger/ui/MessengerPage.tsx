'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthContext } from '@/features/auth/lib/use-auth-context'
import {
  messengerApi,
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from '@/features/messenger/api/messenger-api'
import { useSearchUsersQuery } from '@/features/following/api/following-api'
import type { UserSearchItem } from '@/features/following/model/types'
import { messageSchema, type MessageFormValues } from '@/features/messenger/lib/message-schema'
import { MESSENGER_LIMITS, type ChatItem, type Message } from '@/features/messenger/model/types'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import { ROUTES } from '@/shared/config/routes'
import { useAppDispatch } from '@/shared/lib/hooks'
import { Alert } from '@/shared/ui/Alert/Alert'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import TextArea from '@/shared/ui/TextArea/TextArea'
import { Typography } from '@/shared/ui/Typography/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import s from './MessengerPage.module.scss'

const EMPTY_CHATS: ChatItem[] = []
const EMPTY_MESSAGES: Message[] = []
const EMPTY_SEARCH_ITEMS: UserSearchItem[] = []

// Дебаунс сетевого поиска по username, чтобы не дёргать /users/search на каждый ввод.
const SEARCH_DEBOUNCE_MS = 350
const SEARCH_PAGE_SIZE = 20

const messageTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
})

const messageDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
})

const buildProfileChat = ({
  userId,
  username,
  avatarUrl,
}: {
  userId: string
  username: string
  avatarUrl?: string | null
}): ChatItem => ({
  id: userId,
  participant: {
    userId,
    username,
    avatarUrl: avatarUrl ?? null,
  },
  lastMessage: null,
  unreadCount: 0,
  updatedAt: new Date(0).toISOString(),
})

const getMessagePreview = (message: Message | null) => {
  if (!message) {
    return 'No messages yet'
  }
  if (message.content) {
    return message.content
  }
  if (message.imageUrl) {
    return 'Image'
  }
  if (message.voiceUrl) {
    return 'Voice message'
  }

  return 'New message'
}

const getAvatarLetter = (username: string) => username.charAt(0).toUpperCase() || '?'

const formatChatTimestamp = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime()) || date.getTime() === 0) {
    return ''
  }

  const now = new Date()
  const isSameDay =
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()

  return isSameDay ? messageTimeFormatter.format(date) : messageDateFormatter.format(date)
}

const isOwnMessage = (message: Message, currentUserId?: string) => currentUserId && message.senderId === currentUserId

export const MessengerPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { user } = useAuthContext()
  const currentUserId = user?.userId

  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [errorText, setErrorText] = useState<string | null>(null)

  const trimmedSearch = searchValue.trim()
  const hasSearch = trimmedSearch.length > 0
  const deferredSearchValue = useDeferredValue(trimmedSearch.toLowerCase())
  const selectedRecipientId = searchParams.get('recipientId')?.trim() || null

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(trimmedSearch), SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [trimmedSearch])

  const {
    data: chatsData,
    isLoading: isChatsLoading,
    isFetching: isChatsFetching,
    isError: isChatsError,
    refetch: refetchChats,
  } = useGetChatsQuery()

  const chats = chatsData?.items ?? EMPTY_CHATS
  const existingChat = chats.find((chat) => chat.id === selectedRecipientId) ?? null
  const shouldLoadSelectedProfile = !!selectedRecipientId && !existingChat

  const {
    data: searchData,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useSearchUsersQuery(
    { username: debouncedSearch, pageSize: SEARCH_PAGE_SIZE },
    { skip: debouncedSearch.length === 0 }
  )

  // В результатах оставляем только тех, с кем ещё нет чата (их и так видно выше) и кроме себя.
  const searchUserResults = useMemo(() => {
    const items = searchData?.items ?? EMPTY_SEARCH_ITEMS

    return items.filter((item) => item.id !== currentUserId && !chats.some((chat) => chat.id === item.id))
  }, [searchData, chats, currentUserId])

  const isSearchPending = hasSearch && (debouncedSearch !== trimmedSearch || isSearchFetching)

  const {
    data: selectedProfile,
    isFetching: isSelectedProfileFetching,
    isError: isSelectedProfileError,
  } = useGetProfileQuery(selectedRecipientId ?? '', { skip: !shouldLoadSelectedProfile })

  const syntheticChat = useMemo(() => {
    // При переключении чатов getProfile на время фетча отдаёт профиль прежнего получателя.
    // Берём профиль только когда он совпал с текущим recipientId, иначе synthetic-чат
    // получит чужой id и продублирует уже существующий чат в списке.
    if (!selectedRecipientId || !selectedProfile || selectedProfile.userId !== selectedRecipientId) {
      return null
    }

    return buildProfileChat({
      userId: selectedProfile.userId,
      username: selectedProfile.username,
      avatarUrl: selectedProfile.avatar?.[0]?.url ?? null,
    })
  }, [selectedProfile, selectedRecipientId])

  const visibleChats = useMemo(() => {
    const merged = syntheticChat && !existingChat ? [syntheticChat, ...chats] : chats

    // Страховка от дублей id (ключи <li>): synthetic-чат и live newMessage могут на мгновение пересечься.
    const seen = new Set<string>()
    const items = merged.filter((chat) => {
      if (seen.has(chat.id)) {
        return false
      }
      seen.add(chat.id)

      return true
    })

    if (!deferredSearchValue) {
      return items
    }

    return items.filter((chat) => chat.participant.username.toLowerCase().includes(deferredSearchValue))
  }, [chats, deferredSearchValue, existingChat, syntheticChat])

  const selectedChat = existingChat ?? syntheticChat

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isFetching: isMessagesFetching,
    isError: isMessagesError,
    refetch: refetchMessages,
  } = useGetMessagesQuery({ recipientId: selectedRecipientId ?? '' }, { skip: !selectedRecipientId })

  const messages = messagesData?.items ?? EMPTY_MESSAGES
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
    mode: 'onChange',
  })

  const contentValue = watch('content')

  const updateRecipientInUrl = useCallback(
    (recipientId: string, mode: 'push' | 'replace' = 'push') => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('recipientId', recipientId)

      startTransition(() => {
        if (mode === 'replace') {
          router.replace(`${pathname}?${params.toString()}`)
        } else {
          router.push(`${pathname}?${params.toString()}`)
        }
      })
    },
    [pathname, router, searchParams]
  )

  // Клик по найденному пользователю: открываем переписку (synthetic-чат построится
  // по recipientId через getProfile) и чистим строку, чтобы вернуться к списку чатов.
  const handleSelectUser = useCallback(
    (userId: string) => {
      setSearchValue('')
      setDebouncedSearch('')
      updateRecipientInUrl(userId)
    },
    [updateRecipientInUrl]
  )

  useEffect(() => {
    if (selectedRecipientId || chats.length === 0) {
      return
    }

    updateRecipientInUrl(chats[0]!.id, 'replace')
  }, [chats, selectedRecipientId, updateRecipientInUrl])

  useEffect(() => {
    if (!selectedRecipientId) {
      return
    }

    dispatch(
      messengerApi.util.updateQueryData('getChats', undefined, (draft) => {
        const chat = draft.items.find((item) => item.id === selectedRecipientId)

        if (chat) {
          chat.unreadCount = 0
        }
      })
    )
  }, [dispatch, selectedRecipientId])

  useEffect(() => {
    reset({ content: '' })
    setErrorText(null)
  }, [reset, selectedRecipientId])

  const submitMessage = handleSubmit(async ({ content }) => {
    if (!selectedRecipientId || !selectedChat) {
      return
    }

    const trimmedContent = content.trim()

    if (!existingChat) {
      dispatch(
        messengerApi.util.updateQueryData('getChats', undefined, (draft) => {
          const alreadyExists = draft.items.some((item) => item.id === selectedChat.id)

          if (!alreadyExists) {
            draft.items.unshift(selectedChat)
          }
        })
      )
    }

    try {
      await sendMessage({
        recipientId: selectedRecipientId,
        content: trimmedContent,
        clientMessageId: crypto.randomUUID(),
        currentUserId,
      }).unwrap()

      reset({ content: '' })
    } catch {
      setErrorText('Failed to send message')
    }
  })

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }

    event.preventDefault()
    void submitMessage()
  }

  const showChatsSkeleton = chats.length === 0 && (isChatsLoading || isChatsFetching)
  const showMessagesSkeleton =
    !!selectedRecipientId && messages.length === 0 && (isMessagesLoading || isMessagesFetching)
  const composerDisabled = !selectedRecipientId || isSending || isSubmitting || !isValid

  return (
    <section className={s.page}>
      {errorText && <Alert status="error" text={errorText} position="bottom-left" autoDismiss={3000} />}

      <div className={s.layout}>
        <aside className={s.sidebar}>
          <div className={s.sidebarHeader}>
            <Typography as="h1" variant="h2">
              Messenger
            </Typography>
            <Input
              type="search"
              placeholder="Search chats"
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
            />
          </div>

          <div className={s.sidebarBody}>
            {showChatsSkeleton ? (
              <div className={s.chatSkeletons} aria-label="Loading chats">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`chat-skeleton-${index}`} className={s.chatSkeletonRow}>
                    <Skeleton width={48} height={48} borderRadius="50%" />
                    <div className={s.chatSkeletonText}>
                      <Skeleton width="55%" height={16} />
                      <Skeleton width="80%" height={12} />
                    </div>
                  </div>
                ))}
              </div>
            ) : isChatsError ? (
              <div className={s.centerState}>
                <Typography variant="regular_text_16">Failed to load chats.</Typography>
                <Button variant="secondary" onClick={() => refetchChats()}>
                  Retry
                </Button>
              </div>
            ) : visibleChats.length === 0 ? (
              hasSearch ? null : (
                <div className={s.centerState}>
                  <Typography variant="regular_text_16">
                    {"No chats yet - start by clicking Send Message on someone's profile"}
                  </Typography>
                </div>
              )
            ) : (
              <ul className={s.chatList}>
                {visibleChats.map((chat) => {
                  const isActive = chat.id === selectedRecipientId
                  const avatarUrl = chat.participant.avatarUrl

                  return (
                    <li key={chat.id}>
                      <button
                        type="button"
                        className={`${s.chatRow} ${isActive ? s.chatRowActive : ''}`.trim()}
                        onClick={() => updateRecipientInUrl(chat.id)}
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={chat.participant.username}
                            width={48}
                            height={48}
                            className={s.avatar}
                          />
                        ) : (
                          <div className={s.avatarPlaceholder} aria-hidden>
                            {getAvatarLetter(chat.participant.username)}
                          </div>
                        )}

                        <div className={s.chatContent}>
                          <div className={s.chatMeta}>
                            <Typography as="span" variant="bold_text_16" className={s.chatName}>
                              {chat.participant.username}
                            </Typography>
                            {chat.updatedAt && (
                              <Typography as="span" variant="small_text" className={s.chatTime}>
                                {formatChatTimestamp(chat.updatedAt)}
                              </Typography>
                            )}
                          </div>

                          <div className={s.chatMeta}>
                            <Typography as="span" variant="regular_text_14" className={s.chatPreview}>
                              {getMessagePreview(chat.lastMessage)}
                            </Typography>
                            {chat.unreadCount > 0 && <span className={s.unreadBadge}>{chat.unreadCount}</span>}
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {hasSearch && (
              <div className={s.searchResults}>
                <Typography as="span" variant="small_text" className={s.sectionLabel}>
                  Users
                </Typography>

                {isSearchPending && searchUserResults.length === 0 ? (
                  <div className={s.chatSkeletons} aria-label="Searching users">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`user-skeleton-${index}`} className={s.chatSkeletonRow}>
                        <Skeleton width={48} height={48} borderRadius="50%" />
                        <div className={s.chatSkeletonText}>
                          <Skeleton width="55%" height={16} />
                          <Skeleton width="35%" height={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isSearchError ? (
                  <Typography variant="regular_text_14" className={s.searchStatus}>
                    Failed to search users.
                  </Typography>
                ) : searchUserResults.length === 0 ? (
                  <Typography variant="regular_text_14" className={s.searchStatus}>
                    {`No users found for "${trimmedSearch}".`}
                  </Typography>
                ) : (
                  <ul className={s.chatList}>
                    {searchUserResults.map((user) => (
                      <li key={user.id}>
                        <button type="button" className={s.chatRow} onClick={() => handleSelectUser(user.id)}>
                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt={user.username}
                              width={48}
                              height={48}
                              className={s.avatar}
                            />
                          ) : (
                            <div className={s.avatarPlaceholder} aria-hidden>
                              {getAvatarLetter(user.username)}
                            </div>
                          )}

                          <div className={s.chatContent}>
                            <div className={s.chatMeta}>
                              <Typography as="span" variant="bold_text_16" className={s.chatName}>
                                {user.username}
                              </Typography>
                            </div>
                            <Typography as="span" variant="regular_text_14" className={s.userHint}>
                              Send message
                            </Typography>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </aside>

        <div className={s.chatPanel}>
          {!selectedRecipientId ? (
            <div className={s.emptyPanel}>
              <Typography variant="h3">Select a chat</Typography>
              <Typography variant="regular_text_16">Choose a conversation from the list to start messaging.</Typography>
            </div>
          ) : !selectedChat && isSelectedProfileFetching ? (
            <div className={s.messageSkeletons}>
              <Skeleton width="100%" height={72} borderRadius="0" />
              <div className={s.messageSkeletonStack}>
                <Skeleton width="32%" height={52} borderRadius="12px" />
                <Skeleton width="48%" height={52} borderRadius="12px" />
                <Skeleton width="28%" height={52} borderRadius="12px" />
              </div>
            </div>
          ) : !selectedChat && isSelectedProfileError ? (
            <div className={s.centerState}>
              <Typography variant="regular_text_16">Failed to load this chat recipient.</Typography>
            </div>
          ) : (
            <>
              <header className={s.chatHeader}>
                {selectedChat?.participant.avatarUrl ? (
                  <Image
                    src={selectedChat.participant.avatarUrl}
                    alt={selectedChat.participant.username}
                    width={42}
                    height={42}
                    className={s.headerAvatar}
                  />
                ) : (
                  <div className={s.headerAvatarPlaceholder} aria-hidden>
                    {getAvatarLetter(selectedChat?.participant.username ?? '?')}
                  </div>
                )}

                <div className={s.headerInfo}>
                  <Typography as="span" variant="bold_text_16">
                    {selectedChat?.participant.username}
                  </Typography>
                  {selectedChat && (
                    <Link href={ROUTES.DYNAMIC.PROFILE(selectedChat.participant.userId)} className={s.profileLink}>
                      View profile
                    </Link>
                  )}
                </div>
              </header>

              <div className={s.messagesArea}>
                {showMessagesSkeleton ? (
                  <div className={s.messageSkeletonStack} aria-label="Loading messages">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton
                        key={`message-skeleton-${index}`}
                        width={index % 2 === 0 ? '38%' : '56%'}
                        height={54}
                        borderRadius="16px"
                      />
                    ))}
                  </div>
                ) : isMessagesError ? (
                  <div className={s.centerState}>
                    <Typography variant="regular_text_16">Failed to load messages.</Typography>
                    <Button variant="secondary" onClick={() => refetchMessages()}>
                      Retry
                    </Button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className={s.emptyMessages}>
                    <Typography variant="regular_text_16">No messages yet</Typography>
                  </div>
                ) : (
                  <ul className={s.messageList}>
                    {messages
                      .slice()
                      .reverse()
                      .map((message) => {
                        const own = isOwnMessage(message, currentUserId)

                        return (
                          <li key={message.id} className={`${s.messageRow} ${own ? s.messageRowOwn : ''}`.trim()}>
                            {!own &&
                              (selectedChat?.participant.avatarUrl ? (
                                <Image
                                  src={selectedChat.participant.avatarUrl}
                                  alt={selectedChat.participant.username}
                                  width={36}
                                  height={36}
                                  className={s.messageAvatar}
                                />
                              ) : (
                                <div className={s.messageAvatarPlaceholder} aria-hidden>
                                  {getAvatarLetter(selectedChat?.participant.username ?? '?')}
                                </div>
                              ))}
                            <div
                              className={`${s.messageBubble} ${own ? s.messageBubbleOwn : ''} ${
                                message.status === 'pending' ? s.messagePending : ''
                              } ${message.status === 'failed' ? s.messageFailed : ''}`.trim()}
                            >
                              {message.content && <Typography variant="regular_text_16">{message.content}</Typography>}
                              {!message.content && message.imageUrl && (
                                <Typography variant="regular_text_16">Image</Typography>
                              )}
                              {!message.content && !message.imageUrl && message.voiceUrl && (
                                <Typography variant="regular_text_16">Voice message</Typography>
                              )}
                              <div className={s.messageFooter}>
                                {message.status === 'failed' && (
                                  <Typography as="span" variant="small_text" className={s.failedLabel}>
                                    Failed
                                  </Typography>
                                )}
                                <Typography as="span" variant="small_text" className={s.messageTime}>
                                  {formatChatTimestamp(message.createdAt)}
                                </Typography>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                  </ul>
                )}
              </div>

              <form className={s.composer} onSubmit={submitMessage}>
                <TextArea
                  label=""
                  placeholder="Write a message..."
                  disabled={!selectedRecipientId || isSending || isSubmitting}
                  error={!!errors.content?.message}
                  errorMessage={errors.content?.message}
                  maxLength={MESSENGER_LIMITS.CONTENT_MAX_LENGTH}
                  {...register('content')}
                  onKeyDown={handleComposerKeyDown}
                />
                <div className={s.composerFooter}>
                  <Typography variant="small_text" className={s.characterCount}>
                    {contentValue?.length ?? 0}/{MESSENGER_LIMITS.CONTENT_MAX_LENGTH}
                  </Typography>
                  <Button type="submit" disabled={composerDisabled}>
                    Send
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
