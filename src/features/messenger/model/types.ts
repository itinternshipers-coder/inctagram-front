import { ErrorResponse } from '@/shared/api/types'

export type MessageStatus = 'pending' | 'sent' | 'failed'

export type ChatParticipant = {
  userId: string
  username: string
  avatarUrl?: string | null
}

export type Message = {
  id: string
  senderId: string
  recipientId: string
  content: string | null
  imageUrl: string | null
  voiceUrl: string | null
  clientMessageId: string
  createdAt: string
  // Клиентское поле, бэк не присылает. Заполняется в sendMessage.
  status?: MessageStatus
}

// Бэк не подтвердил, что список чатов есть в API.
// По т.з. UC-1 нужен (меню Messenger показывает список + поиск по username).
// Оставлено до уточнения шейпа от бэка.
export type ChatItem = {
  id: string
  participant: ChatParticipant
  lastMessage: Message | null
  unreadCount: number
  updatedAt: string
}

export type GetChatsRequest = {
  search?: string
  cursor?: string
  pageSize?: number
}

export type GetChatsResponse = {
  items: ChatItem[]
  nextCursor: string | null
  hasMore: boolean
}

// Идентификация переписки — по recipientId (бэк работает по парам userId, в payload sendMessage нет chatId).
export type GetMessagesRequest = {
  recipientId: string
  cursor?: string
  pageSize?: number
}

export type GetMessagesResponse = {
  items: Message[]
  nextCursor: string | null
  hasMore: boolean
}

// recipientId обязателен, должно быть хотя бы одно из content/imageUrl/voiceUrl.
// clientMessageId у бэка optional, но для оптимистичной дедупликации мы всегда генерим UUID.
export type SendMessageRequest = {
  recipientId: string
  content?: string
  imageUrl?: string
  voiceUrl?: string
  clientMessageId: string
}

export type SendMessageAck = {
  ok: boolean
  data?: Message
  code?: string
  message?: string
}

export type UploadMessengerImageRequest = File
export type UploadMessengerImageResponse = { url: string }

export type UploadMessengerVoiceRequest = { file: File; durationSec: number }
export type UploadMessengerVoiceResponse = { url: string; durationSec: number }

export type MessengerError = ErrorResponse

export const MESSENGER_LIMITS = {
  IMAGE_MAX_BYTES: 1 * 1024 * 1024,
  VOICE_MAX_BYTES: 3 * 1024 * 1024,
  VOICE_MAX_DURATION_SEC: 60,
  CONTENT_MAX_LENGTH: 500,
} as const

// На сегодня (21.05.2026) у бэка реализованы только sendMessage / newMessage + REST для image/voice.
// Списка чатов, истории сообщений и chat:updated нет.
// Фронт по UC-1 строит локальное состояние из live newMessage и оптимистичных sendMessage.
// Когда у бэка появятся соответствующие ручки — сюда добавятся новые ключи + queryFn в
// getChats/getMessages поменяется с пустого ответа на эмит/REST.
export const MESSENGER_WS_EVENTS = {
  MESSAGE_SEND: 'sendMessage',
  MESSAGE_NEW: 'newMessage',
} as const
