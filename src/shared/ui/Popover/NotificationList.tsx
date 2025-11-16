'use client'

import React from 'react'
import { Typography } from '@/shared/ui/Typography/Typography'
import s from './NotificationList.module.scss'

export type Notification = {
  id: string
  title: string
  message: string
  date: string
  isNew?: boolean
}

type NotificationProps = {
  notifications?: Notification[]
  notificationHandlerAction?: () => void
}

export default function NotificationList({ notifications = [], notificationHandlerAction }: NotificationProps) {
  return (
    <div className={s.notificationsList} onClick={notificationHandlerAction}>
      {notifications.map((n) => (
        <div key={n.id} className={s.notification}>
          <div className={s.notificationHeader}>
            <Typography as="span" variant="bold_text_14">
              {n.title}
            </Typography>
            {n.isNew && (
              <Typography as="span" variant="regular_text_14" className={s.newBadge}>
                Новое
              </Typography>
            )}
          </div>

          <Typography variant="regular_text_14" className={s.message}>
            {n.message}
          </Typography>

          <Typography variant="small_text" className={s.date}>
            {n.date}
          </Typography>
        </div>
      ))}
    </div>
  )
}
