'use client'
import React from 'react'
import clsx from 'clsx'
import styles from './RadioGroup.module.scss'

export type RadioOption = {
  value: string
  label: string
  disabled?: boolean
}

export type RadioGroupProps = {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  name: string
  className?: string
  disabled?: boolean
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  name,
  className,
  disabled = false,
}) => {
  const handleChange = (optionValue: string, optionDisabled?: boolean) => {
    if (!disabled && !optionDisabled && onChange) {
      onChange(optionValue)
    }
  }

  return (
    <div className={clsx(styles.radioGroup, className)}>
      {options.map((option) => {
        const isChecked = value === option.value
        const isDisabled = disabled || option.disabled

        return (
          <label
            key={option.value}
            className={clsx(styles.radioLabel, {
              [styles.active]: isChecked && !isDisabled,
              [styles.disabled]: isDisabled,
            })}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={() => handleChange(option.value, option.disabled)}
              disabled={isDisabled}
              className={styles.radioInput}
            />
            <span
              className={clsx(styles.radioCircle, {
                [styles.checked]: isChecked,
                [styles.disabled]: isDisabled,
              })}
            >
              <span className={styles.radioInner} />
            </span>
            <span className={styles.radioText}>{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}
