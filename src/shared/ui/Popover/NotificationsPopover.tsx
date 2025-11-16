'use client'

import { Scrollbar } from '@/shared/ui/Scrollbar/Scrollbar'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import s from './NotificationsPopover.module.scss'
import React from 'react'

type NotificationsPopoverProps = {
  unreadCount?: number
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}

export default function NotificationsPopover({
  content,
  children,
  side = 'bottom',
  align = 'end',
  sideOffset = 8,
  className,
}: NotificationsPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={clsx(s.content, className)} side={side} sideOffset={sideOffset} align={align}>
          <div className={s.header}>
            <h3 className={s.title}>Уведомления</h3>
            <button className={s.clearBtn}>Очистить всё</button>
          </div>

          <div className={s.notificationsListWrapper}>
            <Scrollbar>{content}</Scrollbar>
          </div>

          <Popover.Arrow className={s.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
