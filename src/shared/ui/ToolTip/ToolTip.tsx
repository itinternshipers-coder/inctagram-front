'use client'

import { OutlineBellIcon } from '@/shared/icons/svgComponents'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as React from 'react'
import s from '@/shared/ui/tooltip/Tooltip.module.scss'

type Notification = {
  id: string
  title: string
  message: string
  time: string
  isNew?: boolean
}

type ToolTipProps = {
  notifications?: Notification[]
  unreadCount?: number
}

export const ToolTip: React.FC<ToolTipProps> = ({ unreadCount = 0, notifications = [] }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className={s.trigger}>
            <OutlineBellIcon />
            {unreadCount > 0 && <span className={s.badge}>{unreadCount}</span>}
          </button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content className={s.content} sideOffset={5} align="end">
            <div className={s.notificationsContainer}>
              <div className={s.header}>
                <h3 className={s.title}>Уведомления</h3>
              </div>
              <div className={s.notificationsList}>
                {notifications.map((notification) => (
                  <div key={notification.id} className={s.notification}>
                    <div className={s.notificationHeader}>
                      <div className={s.notificationTitle}>{notification.title}</div>
                      {notification.isNew && <div className={s.newBadge}> Новое</div>}
                    </div>
                    <p className={s.notificationMessage}>{notification.message}</p>
                    <span className={s.notificationTime}>{notification.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <Tooltip.Arrow className={s.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
