'use client'

import { OutlineBellIcon } from '@/shared/icons/svgComponents'
import s from '@/shared/ui/ToolTip/ToolTip.module.scss'
import * as Tooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import * as React from 'react'

type ToolTipProps = {
  unreadCount?: number
  openDelay?: number
  closeDelay?: number
  position?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  className?: string
  content?: React.ReactNode
  children?: React.ReactNode
}

export default function ToolTip({
  unreadCount = 0,
  children,
  content,
  openDelay = 200,
  closeDelay = 200,
  position = 'bottom',
  sideOffset = 5,
  className,
}: ToolTipProps) {
  return (
    <Tooltip.Provider delayDuration={openDelay} skipDelayDuration={closeDelay}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          {children || (
            <button className={s.trigger}>
              <OutlineBellIcon />
              {unreadCount > 0 && <span className={s.badge}>{unreadCount}</span>}
            </button>
          )}
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content className={clsx(s.content, className)} side={position} sideOffset={sideOffset} align="end">
            <div className={s.notificationsContainer}>
              <div className={s.header}>
                <h3 className={s.title}>Уведомления</h3>
              </div>
              {content}
            </div>
            <Tooltip.Arrow className={s.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
