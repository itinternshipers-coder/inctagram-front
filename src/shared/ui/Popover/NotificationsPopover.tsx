'use client'

import * as Popover from '@radix-ui/react-popover'
import { OutlineBellIcon } from '@/shared/icons/svgComponents'
import clsx from 'clsx'
import s from './NotificationsPopover.module.scss'
import React from 'react'
import { Typography } from '@/shared/ui/typography/Typography'

type NotificationsPopoverProps = {
  unreadCount?: number
  content: React.ReactNode
  children?: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

export default function NotificationsPopover({
  unreadCount = 0,
  content,
  children,
  side = 'bottom',
  sideOffset = 8,
}: NotificationsPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {children ?? (
          <button className={s.trigger} aria-label="Открыть уведомления">
            <OutlineBellIcon />
            {unreadCount > 0 && <span className={s.badge}>{unreadCount}</span>}
          </button>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={clsx(s.content, 'animate-fade-in')} side={side} sideOffset={sideOffset} align="end">
          <div className={s.header}>
            <Typography as="h3" variant="bold_text_16" className={s.title}>
              Уведомления
            </Typography>
            <button className={s.clearBtn}>
              <Typography variant="small_link">Очистить всё</Typography>
            </button>
          </div>

          <div className={s.notificationsListWrapper}>{content}</div>

          <div className={s.footer}>
            <button className={s.viewAll}>
              <Typography variant="medium_text_14">Посмотреть все</Typography>
            </button>
          </div>

          <Popover.Arrow className={s.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
