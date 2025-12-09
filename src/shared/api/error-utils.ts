import type { ErrorResponse } from './types'

type AnyError = {
  errorsMessages?: ErrorResponse['errorsMessages']
  data?: unknown
  message?: string
}

export const normalizeError = (error: unknown): ErrorResponse | null => {
  const err = error as AnyError

  if (!error) return null

  // Если уже наш формат
  if (err.errorsMessages) {
    return { errorsMessages: err.errorsMessages }
  }

  // Если RTK Query error с data
  if (err.data !== undefined && err.data !== null) {
    // Проверяем, является ли data строкой
    if (typeof err.data === 'string') {
      return {
        errorsMessages: [{ field: 'server', message: err.data }],
      }
    }

    // Если data - объект, проверяем на errorsMessages
    if (typeof err.data === 'object') {
      const data = err.data as AnyError
      if (data.errorsMessages) {
        return { errorsMessages: data.errorsMessages }
      }
    }
  }

  // Любая другая ошибка
  return {
    errorsMessages: [
      {
        field: 'unknown',
        message: err.message || 'Unknown error occurred',
      },
    ],
  }
}
