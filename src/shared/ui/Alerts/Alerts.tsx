'use client'
import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import clsx from 'clsx'
import { useState } from 'react'
import s from './Alerts.module.scss'

type AlertsProps = {
  status: 'success' | 'error'
  text?: string
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export const Alerts = ({ status, text, position }: AlertsProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const onClickHandler = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
    }, 600)
  }

  if (!isVisible) return null

  return (
    <>
      <div className={clsx(s.alert, s[status], isClosing && s.closing, s[position])}>
        <p>
          {status === 'success' ? text || 'Your settings are saved' : `Error! ${text || 'Server is not available'}`}
        </p>
        <Button variant={'tertiary'} className={s.button} onClick={onClickHandler} type="button">
          {<CloseOutlineIcon width={24} height={24} />}
        </Button>
      </div>
    </>
  )
}
