/**
 * Форматирует ISO дату в формат DD.MM.YYYY
 * @example formatDate('2026-02-06T10:45:35.218Z') // '06.02.2026'
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

/**
 * Форматирует ISO дату в формат DD.MM.YYYY HH:mm
 * @example formatDateWithTime('2026-02-06T10:45:35.218Z') // '06.02.2026 10:45'
 */
export const formatDateWithTime = (isoDate: string): string => {
  const date = new Date(isoDate)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}

/**
 * Форматирует дату с использованием локали
 * @example formatDateLocalized('2026-02-06T10:45:35.218Z', 'ru-RU') // '06.02.2026'
 */
export const formatDateLocalized = (
  isoDate: string,
  locale: string = 'ru-RU',
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(isoDate)

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }

  return date.toLocaleDateString(locale, defaultOptions)
}

/**
 * Форматирует дату и время с использованием локали
 * @example formatDateTimeLocalized('2026-02-06T10:45:35.218Z') // '06.02.2026, 10:45'
 */
export const formatDateTimeLocalized = (
  isoDate: string,
  locale: string = 'ru-RU',
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(isoDate)

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }

  return date.toLocaleDateString(locale, defaultOptions)
}

/**
 * Проверяет валидность даты
 */
export const isValidDate = (date: unknown): date is Date => {
  if (!(date instanceof Date)) return false
  return !isNaN(date.getTime())
}

/**
 * Проверяет валидность строки даты
 */
export const isValidDateString = (dateString: string): boolean => {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}
