export function formatTimeAgo(dateString: string, locale: 'ru' | 'en' = 'ru'): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    if (locale === 'en') return interval === 1 ? '1 Year ago' : `${interval} Years ago`
    return interval === 1 ? '1 год назад' : `${interval} года/лет назад`
  }

  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    if (locale === 'en') return interval === 1 ? '1 Month ago' : `${interval} Months ago`
    return `${interval} мес. назад`
  }

  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    if (locale === 'en') {
      if (interval === 1) return 'Yesterday'
      if (interval < 7) return `${interval} Days ago`
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    }
    if (interval === 1) return 'вчера'
    if (interval < 7) return `${interval} дн. назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    if (locale === 'en') return interval === 1 ? '1 Hour ago' : `${interval} Hours ago`
    return interval === 1 ? '1 час назад' : `${interval} ч. назад`
  }

  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    if (locale === 'en') return interval === 1 ? '1 min ago' : `${interval} min ago`
    return interval === 1 ? '1 минуту назад' : `${interval} мин. назад`
  }

  if (locale === 'en') return 'just now'
  return 'только что'
}
