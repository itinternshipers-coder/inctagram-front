'use client'

import React from 'react'
import { clsx } from 'clsx'
import s from './Scrollbar.module.scss'
import * as ScrollArea from '@radix-ui/react-scroll-area'

type ScrollbarProps = {
  childClassName?: string
  onScroll?: React.UIEventHandler<HTMLDivElement>
} & ScrollArea.ScrollAreaProps

export const Scrollbar = ({ className, children, childClassName, onScroll, ...rest }: ScrollbarProps) => {
  return (
    <ScrollArea.Root className={clsx(s.root, className)} {...rest}>
      <ScrollArea.Viewport className={clsx(s.viewPort, childClassName)} onScroll={onScroll}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={s.scrollBar} orientation="horizontal">
        <ScrollArea.Thumb className={s.areaThumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className={s.scrollBar} orientation="vertical">
        <ScrollArea.Thumb className={s.areaThumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className={s.corner} />
    </ScrollArea.Root>
  )
}
