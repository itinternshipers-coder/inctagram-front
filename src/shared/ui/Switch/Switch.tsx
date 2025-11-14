'use client'

import ToolTip from '@/shared/ui/ToolTip/ToolTip'
import { clsx } from 'clsx'
import React from 'react'
import * as Switcher from '@radix-ui/react-switch'
import s from './Switch.module.scss'

type Props = {
  className?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = ({ className, checked, onCheckedChange }: Props) => {
  return (
    <ToolTip text={'switch theme'} openDelay={1000} position={'bottom'}>
      <Switcher.Root className={clsx(s.root, className)} checked={checked} onCheckedChange={onCheckedChange}>
        <Switcher.Thumb className={s.thumb} />
      </Switcher.Root>
    </ToolTip>
  )
}
