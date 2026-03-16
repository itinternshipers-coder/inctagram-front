'use client'

import ReCAPTCHA from 'react-google-recaptcha'
import { useTheme } from '@/shared/providers/ThemeProvider'
import s from './Recaptcha.module.scss'

export type Props = {
  onChange?: (token: string | null) => void
  onExpired?: () => void
}

const sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!

export const Recaptcha = ({ onChange, onExpired }: Props) => {
  const { theme } = useTheme()

  if (typeof window === 'undefined') return null

  return (
    <div className={s.wrapper}>
      <div className={s.recaptchaContainer}>
        <ReCAPTCHA
          key={theme}
          theme={theme === 'dark' ? 'dark' : 'light'}
          sitekey={sitekey}
          onChange={onChange}
          onExpired={onExpired}
        />
      </div>
    </div>
  )
}
