'use client'
import { EyeIcon, SearchOutlineIcon } from '@/shared/icons/svgComponents/icons'
import { clsx } from 'clsx'
import React, { forwardRef, useId, useState } from 'react'
import styles from './Input.module.scss'

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label?: string
  error?: string
  wrapperClassName?: string
  id?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id: externalId, type = 'text', wrapperClassName, className, disabled, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const generatedId = useId()
    const id = externalId || generatedId

    const isPassword = type === 'password'
    const isSearch = type === 'search'
    const inputType = isPassword && showPassword ? 'text' : type

    const handleTogglePassword = (show: boolean) => {
      if (!disabled) {
        setShowPassword(show)
      }
    }

    return (
      <div className={clsx(styles.input, disabled && styles['input--disabled'], wrapperClassName)}>
        {label && (
          <label htmlFor={id} className={styles.input__label}>
            {label}
          </label>
        )}

        <div className={styles.input__wrapper}>
          {isSearch && (
            <span className={styles.input__icon} aria-hidden="true">
              <SearchOutlineIcon />
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            disabled={disabled}
            className={clsx(
              styles.input__field,
              error && styles['input__field--error'],
              isPassword && styles['input__field--password'],
              isSearch && styles['input__field--search'],
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              disabled={disabled}
              onMouseDown={() => handleTogglePassword(true)}
              onMouseUp={() => handleTogglePassword(false)}
              onMouseLeave={() => handleTogglePassword(false)}
              onTouchStart={() => handleTogglePassword(true)}
              onTouchEnd={() => handleTogglePassword(false)}
              className={styles.input__toggle}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              <EyeIcon />
            </button>
          )}
        </div>

        {error && (
          <span id={`${id}-error`} className={styles.input__error} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
