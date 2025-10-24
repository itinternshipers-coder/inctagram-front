import { clsx } from 'clsx'
import React, { ComponentPropsWithoutRef } from 'react'
import styles from '@/shared/ui/input/Input.module.scss'
type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label?: string
  error?: string
  className?: string
}

export const Input: React.FC<InputProps> = ({ className, id, label, error, ...rest }) => {
  return (
    <div className={`${clsx(styles.wrapper)} ${className}`}>
      <label htmlFor={id} className={className}>
        {label}
      </label>
      <input id={id} className={`${clsx(styles.input)} ${error ? styles.inputError : ''}`} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
//TODO: implement full input validation and styles
