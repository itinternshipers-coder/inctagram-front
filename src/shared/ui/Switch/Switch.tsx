'use client'

import React from 'react'
import * as Switcher from '@radix-ui/react-switch'
import { clsx } from 'clsx'
import s from './Switch.module.scss'

type Props = {
  className?: string
  checked?: boolean
  onCheckedChangeAction?: (checked: boolean) => void
  disabled?: boolean
}

export const Switch = ({ className, checked, onCheckedChangeAction, disabled }: Props) => {
  return (
    //<div> добавлен для передачи событий. (наведение в т.ч.)
    <div>
      <Switcher.Root
        className={clsx(s.root, className)}
        checked={checked}
        onCheckedChange={onCheckedChangeAction}
        disabled={disabled}
      >
        <Switcher.Thumb className={s.thumb} />
      </Switcher.Root>
    </div>
  )
}
