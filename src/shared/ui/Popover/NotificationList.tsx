import { clsx } from 'clsx'
import s from './NotificationsPopover.module.scss'
import { Typography } from '@/shared/ui/typography/Typography'

type Notification = {
  id: string
  title: string
  message: string
  time: string
  isNew?: boolean
}

type NotificationListProps = {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div className={s.notificationsList}>
      {notifications.map((n) => (
        <div key={n.id} className={clsx(s.notification, n.isNew && s.new)}>
          <div className={s.notificationHeader}>
            <Typography variant="medium_text_14" className={s.notificationTitle}>
              {n.title}
            </Typography>
            {n.isNew && (
              <Typography variant="semi_bold_small_text" className={s.newBadge}>
                Новое
              </Typography>
            )}
          </div>
          <Typography variant="regular_text_14" className={s.notificationMessage}>
            {n.message}
          </Typography>
          <Typography variant="small_text" className={s.notificationTime}>
            {n.time}
          </Typography>
        </div>
      ))}
    </div>
  )
}
