'use client'

import { ArrowIosDownOutlineIcon, ArrowIosUpIcon } from '@/shared/icons/svgComponents'
import * as Select from '@radix-ui/react-select'
import { clsx } from 'clsx'
import * as React from 'react'
import { ComponentPropsWithoutRef } from 'react'
import { Typography } from '../typography/Typography'
import { clsx } from 'clsx'
import s from './SelectBox.module.scss'
import { ArrowBackOutlineIcon, ArrowIosDownOutlineIcon, ArrowIosUpIcon } from '@/shared/icons/svgComponents'

export type Option = {
  value: string
  label: string
  icon?: React.ReactNode
}

type Props = {
  options: Option[]
  label?: string
  placeholder?: string
  minWidth?: string // c width на minWidth
  height?: string

  onValueChange?: (value: string) => void
} & ComponentPropsWithoutRef<typeof Select.Root>

export const SelectBox = ({
  label = '',
  options,
  defaultValue,
  placeholder = 'Select-box',
  minWidth = '210px',
  height = '60px', // нужная высота

  disabled,
  onValueChange,
  value,
}: Props) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className={s.wrapper}
      // style={{ minWidth }} // применяем проп
    >
      {label && (
        <Typography variant="regular_text_14" style={{ color: 'var(--light-900)' }}>
          {label}
        </Typography>
      )}

      <Select.Root
        defaultValue={defaultValue || undefined}
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
        onValueChange={onValueChange}
        value={value}
      >
        <Select.Trigger
          className={clsx(s.trigger, open ? s.active : '', disabled ? s.disabled : '')}
          aria-label={placeholder}
          disabled={disabled}
          style={{ height }} // применяем проп
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <span className={s.arrow}>
              {open ? (
                // <ArrowIosUpIcon width={'16px'} height={'16px'} /> // вот тут
                <ArrowIosUpIcon /> // вот тут
              ) : (
                // <ArrowIosDownOutlineIcon width={'16px'} height={'16px'} /> // вот тут
                <ArrowIosDownOutlineIcon /> // вот тут
              )}
            </span>
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
