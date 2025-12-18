export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return interval === 1 ? '1 год назад' : `${interval} года/лет назад`
  }

  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return `${interval} мес. назад`
  }

  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    if (interval === 1) return 'вчера'
    if (interval < 7) return `${interval} дн. назад`

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    })
  }

  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return interval === 1 ? '1 час назад' : `${interval} ч. назад`
  }

  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return interval === 1 ? '1 минуту назад' : `${interval} мин. назад`
  }

  return 'только что'
}
