import s from '@/shared/ui/ToolTip/ToolTip.module.scss'

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
      {notifications.map((notification) => (
        <div key={notification.id} className={s.notification}>
          <div className={s.notificationHeader}>
            <div className={s.notificationTitle}>{notification.title}</div>
            {notification.isNew && <div className={s.newBadge}>Новое</div>}
          </div>
          <p className={s.notificationMessage}>{notification.message}</p>
          <span className={s.notificationTime}>{notification.time}</span>
        </div>
      ))}
    </div>
  )
}

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Новое уведомление!',
    message: 'Следующий платеж у вас спишется через 1 день',
    time: '1 час назад',
    isNew: true,
  },
  {
    id: '2',
    title: 'Новое уведомление!',
    message: 'Ваша подписка истекает через 7 дней',
    time: '1 день назад',
    isNew: true,
  },
  {
    id: '3',
    title: 'Новое уведомление!',
    message: 'Ваша подписка истекает через 7 дней',
    time: '1 день назад',
    isNew: true,
  },
  {
    id: '3',
    title: 'Старое уведомление',
    message: 'Ваш платеж успешно processed',
    time: '3 дня назад',
    isNew: false,
  },
]
