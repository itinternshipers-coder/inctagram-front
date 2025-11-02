'use client'

import { useEffect, useRef, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { CalendarIcon, CalendarOutlineIcon } from '@/shared/icons/svgComponents'
import 'react-day-picker/dist/style.css'
import s from './DatePicker.module.scss'

export type DatePickerMode = 'single' | 'range'

export type Props = {
  mode?: DatePickerMode
  value?: Date | DateRange
  onChange?: (value: Date | DateRange | undefined) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  format?: string
  minDate?: Date
  maxDate?: Date
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
  format: dateFormat = 'dd/MM/yyyy',
  minDate,
  maxDate,
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

  const handleSelect = (val: Date | DateRange | undefined) => {
    onChange?.(val)
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
    disabled: [(date: Date) => (minDate ? date < minDate : false), (date: Date) => (maxDate ? date > maxDate : false)],
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
    button_next: s.next,
    button_previous: s.previous,
  }

  return (
    <div ref={wrapperRef} className={`${s.wrapper} ${className ?? ''}`}>
      {label && <span className={s.label}>{label}</span>}

      <div className={`${s.inputWrapper} ${error ? s.error : ''} ${disabled ? s.disabled : ''}`}>
        <input
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          value={formatValue(value)}
          className={s.input}
          onClick={() => setOpen((prev) => !prev)}
        />
        <span className={s.icon}>
          {open ? (
            <CalendarIcon color={error ? '#cc1439' : undefined} />
          ) : (
            <CalendarOutlineIcon color={error ? '#cc1439 ' : undefined} />
          )}
        </span>
      </div>

      {error && <p className={s.errorText}>{error}</p>}

      {open && !disabled && (
        <div className={s.calendarWrapper}>
          {isRange ? (
            <DayPicker
              mode="range"
              required={false}
              showOutsideDays
              selected={value as DateRange | undefined}
              onSelect={(val) => handleSelect(val as DateRange | undefined)}
              weekStartsOn={1}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              classNames={{
                button_next: s.next,
                button_previous: s.previous,
              }}
            />
          ) : (
            <DayPicker
              mode="single"
              required={false}
              showOutsideDays
              selected={value as Date | undefined}
              onSelect={(val) => handleSelect(val as Date | undefined)}
              weekStartsOn={1}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              classNames={{
                button_next: s.next,
                button_previous: s.previous,
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
