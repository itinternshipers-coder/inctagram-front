'use client'

import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import { Typography } from '../typography/Typography'
import { clsx } from 'clsx'
import s from './selectBox.module.scss'

type Option = {
  value: string
  label: string
  icon?: React.ReactNode
}

type Props = {
  label?: string
  options: Option[]
  defaultValue?: string
  placeholder?: string
  width?: string
  disabled?: boolean
}

export const SelectBox = ({
  label = '',
  options,
  defaultValue,
  placeholder = 'Select-box',
  width = '210px',
  disabled,
}: Props) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={s.wrapper} style={{ width }}>
      {label && (
        <Typography variant="regular_text_14" style={{ color: 'var(--light-900)' }}>
          {label}
        </Typography>
      )}

      <Select.Root defaultValue={defaultValue || undefined} open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
        <Select.Trigger
          className={clsx(s.trigger, open ? s.active : '', disabled ? s.disabled : '')}
          aria-label={placeholder}
          disabled={disabled}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <span className={s.arrow}>{open ? '▴' : '▾'}</span>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className={clsx(s.content, open ? s.active : '')} position="popper" avoidCollisions={false}>
            <Select.Viewport className={s.viewport}>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className={s.block}>
                    {opt.icon && <span className={s.icon}>{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </div>
                </SelectItem>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}

const SelectItem = React.forwardRef<HTMLDivElement, { value: string; children: React.ReactNode }>(
  ({ children, ...props }, ref) => (
    <Select.Item ref={ref} {...props} className={s.item}>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
)
SelectItem.displayName = 'SelectItem'
