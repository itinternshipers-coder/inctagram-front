'use client'
import { CheckmarkOutlineIcon } from '@/shared/icons/svgComponents'
import RecaptchaLogoIcon from '@/shared/icons/svgComponents/icons/RecaptchaLogoIcon'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import s from './Recaptcha.module.scss'

export type RecaptchaProps = {
  /**
   * Начальное состояние компонента
   * @default 'idle'
   */
  initialStatus?: RecaptchaStatus
  /**
   * Callback при изменении статуса
   */
  onStatusChange?: (status: RecaptchaStatus) => void
  /**
   * Время до истечения срока в миллисекундах (2 минуты по умолчанию)
   * @default 120000
   */
  expirationTime?: number
  /**
   * Отключить компонент
   * @default false
   */
  disabled?: boolean
}

export type RecaptchaStatus = 'idle' | 'loading' | 'success' | 'error' | 'expired'

export const Recaptcha = ({
  initialStatus = 'idle',
  onStatusChange,
  expirationTime = 120000,
  disabled = false,
}: RecaptchaProps) => {
  const [status, setStatus] = useState<RecaptchaStatus>(initialStatus)

  const updateStatus = (newStatus: RecaptchaStatus) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }

  const handleClick = () => {
    if (status === 'loading' || status === 'success' || disabled) return

    updateStatus('loading')

    // Симуляция проверки
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2 // 80% успеха

      if (isSuccess) {
        updateStatus('success')

        // Установить таймер истечения
        setTimeout(() => {
          updateStatus('expired')
        }, expirationTime)
      } else {
        updateStatus('error')
        // Автосброс через 3 секунды
        setTimeout(() => updateStatus('idle'), 3000)
      }
    }, 2000)
  }

  const getErrorMessage = () => {
    switch (status) {
      case 'error':
        return 'Please verify that you are not a robot'
      case 'expired':
        return 'Verification expired. Check the checkbox again.'
      default:
        return ''
    }
  }

  // Переменные для статусов
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isExpired = status === 'expired'
  const isIdle = status === 'idle'

  // Переменные для состояний
  const isButtonDisabled = isLoading || isSuccess || disabled
  const hasError = isError || isExpired
  const errorMessage = getErrorMessage()
  const showErrorMessage = isError && errorMessage
  const showExpiredMessage = isExpired && errorMessage

  // Классы
  const wrapperClassName = clsx(s.wrapper, hasError && s.wrapper__error)
  const buttonClassName = clsx(
    s.recaptcha__button,
    isSuccess && s['recaptcha__button--checked'],
    isLoading && s['recaptcha__button--loading']
  )

  return (
    <div className={wrapperClassName}>
      <div className={s.recaptcha}>
        {showExpiredMessage && <span className={s.recaptcha__expired}>{errorMessage}</span>}

        <div className={s.recaptcha__main}>
          <button
            className={buttonClassName}
            onClick={handleClick}
            disabled={isButtonDisabled}
            aria-label="I'm not a robot"
            aria-pressed={isSuccess}
          >
            {isLoading && <span className={s.recaptcha__loader} />}
            {isSuccess && <CheckmarkOutlineIcon size={24} color="#00a650" className={s.recaptcha__checkmark} />}
          </button>
          <span className={s.recaptcha__label}>I&apos;m not a robot</span>
        </div>

        <div className={s.recaptcha__branding}>
          <div className={s.recaptcha__logo}>
            <RecaptchaLogoIcon />
          </div>
          <div className={s.recaptcha__info}>
            <span className={s.recaptcha__title}>reCAPTCHA</span>
            <nav className={s.recaptcha__links}>
              <Link className={s.recaptcha__link} href="/">
                Privacy
              </Link>
              <span className={s.recaptcha__separator} aria-hidden="true"></span>
              <Link className={s.recaptcha__link} href="/">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {showErrorMessage && <span className={s.recaptcha__error}>{errorMessage}</span>}
    </div>
  )
}
