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
  onScrollEnd?: () => void
  hasMore?: boolean
  onOpen?: () => void
}

export default function NotificationsPopover({
  content,
  children,
  side = 'bottom',
  align = 'end',
  sideOffset = 8,
  className,
  onScrollEnd,
  hasMore,
  onOpen,
}: NotificationsPopoverProps) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onScrollEnd || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

    if (scrollHeight - scrollTop - clientHeight < 50) {
      onScrollEnd()
    }
  }

  return (
    <Popover.Root onOpenChange={(open) => open && onOpen?.()}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={clsx(s.content, className)} side={side} sideOffset={sideOffset} align={align}>
          <div className={s.notificationsListWrapper}>
            <Scrollbar onScroll={handleScroll}>{content}</Scrollbar>
          </div>

          <Popover.Arrow className={s.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
