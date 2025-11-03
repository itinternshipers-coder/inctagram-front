'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import s from './ToolTip.module.scss'
import React from 'react'

type ToolTipProps = {
  text: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  openDelay?: number
  className?: string
}

export default function ToolTip({
  text,
  children,
  position = 'top',
  sideOffset = 10,
  openDelay = 300,
  className,
}: ToolTipProps) {
  return (
    <Tooltip.Provider delayDuration={openDelay}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side={position} sideOffset={sideOffset} className={clsx(s.content, className)}>
            <div className={s.tooltipContent}>{text}</div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
