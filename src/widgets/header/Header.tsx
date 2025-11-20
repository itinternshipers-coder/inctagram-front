'use client'
import { Button } from '@/shared/ui/Button/Button'
import { NotificationBell } from '@/shared/ui/NotificationBell/NotificationBell'
import NotificationList from '@/shared/ui/Popover/NotificationList'
import NotificationsPopover from '@/shared/ui/Popover/NotificationsPopover'
import { SelectBox } from '@/shared/ui/SelectBox/SelectBox'
import { ThemeSwitch } from '@/shared/ui/ThemeSwitch/ThemeSwitch'
import { Typography } from '@/shared/ui/Typography/Typography'
import { SelectOption } from '@/widgets/header/SelectOptionsList'
import Link from 'next/link'

import s from './Header.module.scss'

type HeaderProps = {
  isLoginIn: boolean
}

export const Header = ({ isLoginIn }: HeaderProps) => {
  return (
    <header className={s.container}>
      <Typography as={Link} href={'/'} variant={'large'}>
        Inctagram
      </Typography>
      <div>
        {isLoginIn ? (
          <div className={s.authorized_notifications}>
            <NotificationsPopover content={<NotificationList />}>
              <NotificationBell count={3} />
            </NotificationsPopover>
            <SelectBox options={SelectOption} defaultValue={'en'} width={'163px'} />
            <ThemeSwitch className={s.themeSwitch} />
          </div>
        ) : (
          <div className={s.unauthorized_notifications}>
            <SelectBox options={SelectOption} defaultValue={'en'} width={'163px'} />
            <div className={s.button}>
              <Button as={Link} href={'/login'} variant={'link'}>
                Log in
              </Button>
              <Button as={Link} href={'/sign-up'} variant={'primary'}>
                Sign up
              </Button>
            </div>
            <ThemeSwitch className={s.themeSwitch} />
          </div>
        )}
      </div>
    </header>
  )
}
