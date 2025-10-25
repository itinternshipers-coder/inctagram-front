'use client'

import { TextareaHTMLAttributes } from 'react'
import styles from './TextAreaBlock.module.scss'

interface TextAreaBlockProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: boolean
  errorMessage?: string
}

export default function TextAreaBlock({
  label = 'Text area',
  disabled = false,
  error = false,
  errorMessage,
  id,
  name,
  value,
  onChange,
  placeholder = 'Text area',
  ...rest
}: TextAreaBlockProps) {
  const textareaId = id || name || 'textarea'

  return (
    <div className={`${styles.textAreaContainer} ${disabled ? styles.disabled : ''}`}>
      <label htmlFor={textareaId}>{label}</label>
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? styles.error : ''}
        aria-invalid={error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        placeholder={placeholder}
        {...rest}
      />
      {error && errorMessage && (
        <span id={`${textareaId}-error`} className={styles.errorText}>
          {errorMessage}
        </span>
      )}
    </div>
  )
}
