'use client'

import { TextareaHTMLAttributes } from 'react'
import s from './TextArea.module.scss'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: boolean
  errorMessage?: string
}

export default function TextArea({
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
}: TextAreaProps) {
  const textareaId = id || name || 'textarea'

  return (
    <div className={`${s.textAreaContainer} ${disabled ? s.disabled : ''}`}>
      <label htmlFor={textareaId}>{label}</label>
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? s.error : ''}
        aria-invalid={error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        placeholder={placeholder}
        {...rest}
      />
      {error && errorMessage && (
        <span id={`${textareaId}-error`} className={s.errorText}>
          {errorMessage}
        </span>
      )}
    </div>
  )
}
