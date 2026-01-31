'use client'

import ReCAPTCHA from 'react-google-recaptcha'
import { useTheme } from '@/shared/providers/ThemeProvider'
import s from './Recaptcha.module.scss'
import { useEffect, useState } from 'react'

export type Props = {
  onChange?: (token: string | null) => void
  onExpired?: () => void
}

const sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!

export const Recaptcha = ({ onChange, onExpired }: Props) => {
  const { theme } = useTheme()
  const [key, setKey] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => setKey((k) => k + 1), 0)
    return () => clearTimeout(id)
  }, [theme])

  return (
    <div className={s.wrapper}>
      <div className={s.recaptchaContainer}>
        <ReCAPTCHA
          key={key}
          theme={theme === 'dark' ? 'dark' : 'light'}
          sitekey={sitekey}
          onChange={onChange}
          onExpired={onExpired}
        />
      </div>
    </div>
  )
}
