import { ErrorResponse } from '@/shared/api/types'

// Получить все сессии
export type GetSessions = {
  request: void
  response: {
    current: {
      deviceId: string
      deviceType: string
      deviceName: string
      browserName: string
      lastActive: string
    }
    others: Array<{
      deviceId: string
      deviceType: string
      deviceName: string
      browserName: string
      lastActive: string
    }>
  }
  error: ErrorResponse
}

// Удалить все сессии (кроме текущей)
export type TerminateAllSessions = {
  request: void
  response: void
  error: ErrorResponse
}

// Удалить конкретную сессию по deviceId
export type TerminateSession = {
  request: {
    deviceId: string
  }
  response: void
  error: ErrorResponse
}
