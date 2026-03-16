import React from 'react'
import { OutlineBellIcon } from '../../icons'
import { Typography } from '../Typography/Typography'
import s from './NotificationBell.module.scss'

type Props = {
  count?: number
} & React.ComponentPropsWithoutRef<'div'>

export const NotificationBell = ({ count = 0, ...rest }: Props) => {
  return (
    <div className={s.bellWrapper} {...rest}>
      <OutlineBellIcon />
      {count > 0 && (
        <Typography as="span" className={s.notification} variant="small_text">
          {count}
        </Typography>
      )}
    </div>
  )
}
