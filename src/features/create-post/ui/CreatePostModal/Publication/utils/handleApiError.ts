import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const handleApiError = (err: unknown, setUploadError: React.Dispatch<React.SetStateAction<string | null>>) => {
  const error = err as FetchBaseQueryError | SerializedError
  let errorMessage = 'Неизвестная ошибка'

  if ('status' in error) {
    // Типизируем data как unknown и проверяем
    const data = error.data as unknown

    if (typeof data === 'object' && data !== null) {
      const errorData = data as Record<string, unknown>

      // Безопасно извлекаем строковые значения
      errorMessage =
        (typeof errorData.message === 'string' ? errorData.message : '') ||
        (typeof errorData.error === 'string' ? errorData.error : '') ||
        (typeof errorData.detail === 'string' ? errorData.detail : '') ||
        `Ошибка ${error.status}`
    } else if (typeof data === 'string') {
      // Если data это просто строка
      errorMessage = data
    } else {
      errorMessage = `Ошибка ${error.status}`
    }
  } else if (error?.message) {
    errorMessage = error.message
  }

  setUploadError(errorMessage)
}
