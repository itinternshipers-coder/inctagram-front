'use client'

import { useEffect, useRef, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { format, parse } from 'date-fns'
import { CalendarIcon, CalendarOutlineIcon } from '@/shared/icons/svgComponents'
import 'react-day-picker/dist/style.css'
import s from './DatePicker.module.scss'
import clsx from 'clsx'

export type DatePickerMode = 'single' | 'range'

export type Props = {
  mode?: DatePickerMode
  value?: string
  onChange?: (value: string | undefined) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  dateFormat?: string
  format?: string
  minDate?: Date
  maxDate?: Date
  fullWidth?: boolean
  className?: string
}

export const DatePicker = ({
  mode = 'single',
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  disabled = false,
  dateFormat = 'dd.MM.yyyy',
  minDate,
  maxDate,
  fullWidth,
  className,
}: Props) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isRange = mode === 'range'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Преобразуем входную строку в Date для календаря
  const dateValue = value ? parse(value, dateFormat, new Date()) : undefined

  // При выборе даты — преобразуем обратно в строку
  const handleSelect = (val: Date | undefined) => {
    if (val) {
      onChange?.(format(val, dateFormat))
    } else {
      onChange?.(undefined)
    }
  }

  const formatDisplayValue = (v: Date | undefined) => {
    return v ? format(v, dateFormat) : ''
  }

  const formatValue = (v: Date | DateRange | undefined) => {
    if (!v) return ''
    if (isRange) {
      const { from, to } = v as DateRange
      if (from && to) return `${format(from, dateFormat)} - ${format(to, dateFormat)}`
      if (from) return format(from, dateFormat)
      return ''
    }
    return v instanceof Date ? format(v, dateFormat) : ''
  }

  const modifiers = {
    disabled: [(date: Date) => !!minDate && date < minDate, (date: Date) => !!maxDate && date > maxDate],
    weekend: (date: Date) => [0, 6].includes(date.getDay()),
  }

  const modifiersClassNames = {
    weekend: s.weekend,
    range_start: s.rangeStart,
    range_end: s.rangeEnd,
    range_middle: s.rangeMiddle,
    selected: s.selected,
    today: s.today,
    disabled: s.disabled,
    outside: s.otherMonth,
  }

  const commonProps = {
    required: false,
    showOutsideDays: true,
    weekStartsOn: 1,
    modifiers,
    modifiersClassNames,
    classNames: {
      month: s.month,
      button_next: s.next,
      button_previous: s.previous,
      weekday: s.weekday,
      week: s.week,
    },
  } as const

  return (
    <div ref={wrapperRef} className={`${s.wrapper} ${className ?? ''}`}>
      {label && <span className={s.label}>{label}</span>}

      <div className={clsx(s.inputWrapper, { [s.error]: error, [s.disabled]: disabled, [s.fullWidth]: fullWidth })}>
        <input
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          value={formatDisplayValue(dateValue)}
          className={s.input}
          onClick={() => setOpen((prev) => !prev)}
        />
        <span className={s.icon}>
          {open ? (
            <CalendarIcon color={error ? 'var(--danger-500)' : undefined} />
          ) : (
            <CalendarOutlineIcon color={error ? 'var(--danger-500)' : undefined} />
          )}
        </span>
      </div>

      {error && <p className={s.errorText}>{error}</p>}

      {open && !disabled && (
        <div className={s.calendarWrapper}>
          {isRange ? (
            <DayPicker
              {...commonProps}
              mode="range"
              selected={value as DateRange | undefined}
              onSelect={(val) => handleSelect(val as DateRange | undefined)}
            />
          ) : (
            <DayPicker
              {...commonProps}
              mode="single"
              selected={value as Date | undefined}
              onSelect={(val) => handleSelect(val as Date | undefined)}
            />
          )}
        </div>
      )}
    </div>
  )
}
