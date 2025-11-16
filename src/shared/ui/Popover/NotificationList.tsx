import { Typography } from '@/shared/ui/Typography/Typography'
import s from './NotificationsPopover.module.scss'

type Notification = {
  id: string
  title: string
  message: string
  time: string
  isNew?: boolean
}

type NotificationProps = {
  notifications?: Notification[]
}

export default function NotificationList({ notifications = [] }: NotificationProps) {
  return (
    <div className={s.notificationsList}>
      {notifications.map((n) => (
        <div key={n.id} className={s.notification}>
          <div className={s.notificationHeader}>
            <Typography as="span" variant="bold_text_14">
              {n.title}
            </Typography>
            {n.isNew && (
              <Typography as="span" variant="small_text" className={s.newBadge}>
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
