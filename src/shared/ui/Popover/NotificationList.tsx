'use client'

import React from 'react'
import { Typography } from '@/shared/ui/Typography/Typography'
import { formatTimeAgo } from '@/shared/lib/formatTimeAgo'
import type { Notification } from '@/features/notifications/model/types'
import s from './NotificationList.module.scss'

type NotificationListProps = {
  notifications?: Notification[]
  onMarkAllAsRead?: () => void
}

export default function NotificationList({ notifications = [], onMarkAllAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className={s.notificationsList}>
        <div className={s.header}>
          <h3 className={s.title}>Уведомления</h3>
        </div>
        <Typography variant="regular_text_14" className={s.empty}>
          Нет уведомлений
        </Typography>
      </div>
    )
  }

  return (
    <div className={s.notificationsList}>
      <div className={s.header}>
        <h3 className={s.title}>Уведомления</h3>
        {onMarkAllAsRead && (
          <button className={s.clearBtn} onClick={onMarkAllAsRead}>
            Прочитать всё
          </button>
        )}
      </div>

      {notifications.map((n) => (
        <div key={n.id} className={s.notification}>
          {!n.isReady && (
            <Typography as="span" variant="regular_text_14" className={s.newBadge}>
              Новое
            </Typography>
          )}

          <Typography variant="regular_text_14" className={s.message}>
            {n.message}
          </Typography>

          <Typography variant="small_text" className={s.date}>
            {formatTimeAgo(n.createdAt)}
          </Typography>
        </div>
      ))}
    </div>
  )
}
