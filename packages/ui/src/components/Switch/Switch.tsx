'use client'

import * as Switcher from '@radix-ui/react-switch'
import { clsx } from 'clsx'
import s from './Switch.module.scss'

type SwitchProps = {
  className?: string
  checked?: boolean
  onCheckedChangeAction?: (checked: boolean) => void
  disabled?: boolean
}

export const Switch = ({ className, checked, onCheckedChangeAction, disabled }: SwitchProps) => {
  return (
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
