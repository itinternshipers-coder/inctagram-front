import { clsx } from 'clsx'
import React, { useState } from 'react'
import styles from './Input.module.scss'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  wrapperClassName?: string
}

export const Input: React.FC<InputProps> = ({ label, error, id, type = 'text', wrapperClassName, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => setShowPassword((prev) => !prev)

  const isPassword = type === 'password'

  return (
    <div className={clsx(styles.input, wrapperClassName)}>
      {label && (
        <label htmlFor={id} className={styles.input__label}>
          {label}
        </label>
      )}
      <div className={styles.input__wrapper}>
        <input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          className={clsx(styles.input__field, error && styles.input__field_error)}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            className={styles.input__toggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? `H` : `S`}
          </button>
        )}
      </div>
      {error && <span className={styles.input__error}>{error}</span>}
    </div>
  )
}
