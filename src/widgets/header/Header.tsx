'use client'
import { ROUTES } from '@/shared/config/routes'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
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
  const { notifications, unreadCount, markAllAsRead, hasMore, loadMore } = useNotifications(!isLoginIn)

  return (
    <header className={s.container}>
      <Typography as={Link} href={ROUTES.PUBLIC.HOME} variant={'large'}>
        Inctagram
      </Typography>
      <div>
        {isLoginIn ? (
          <div className={s.authorized_notifications}>
            <NotificationsPopover
              content={<NotificationList notifications={notifications} onMarkAllAsRead={markAllAsRead} />}
              onScrollEnd={loadMore}
              hasMore={hasMore}
              onOpen={markAllAsRead}
            >
              <NotificationBell count={unreadCount} />
            </NotificationsPopover>
            <SelectBox options={SelectOption} defaultValue={'en'} width={'163px'} />
            <ThemeSwitch className={s.themeSwitch} />
          </div>
        ) : (
          <div className={s.unauthorized_notifications}>
            <SelectBox options={SelectOption} defaultValue={'en'} width={'163px'} />
            <div className={s.button}>
              <Button as={Link} href={ROUTES.PUBLIC.SIGN_IN} variant={'link'}>
                Sign In
              </Button>
              <Button as={Link} href={ROUTES.PUBLIC.SIGN_UP} variant={'primary'}>
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
