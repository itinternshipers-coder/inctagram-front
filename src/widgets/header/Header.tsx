'use client'
import { OutlineBellIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { SelectBox } from '@/shared/ui/SelectBox/SelectBox'
import ToolTip from '@/shared/ui/ToolTip/ToolTip'
import { Typography } from '@/shared/ui/Typography/Typography'
import { SelectOption } from '@/widgets/header/SelectOptionsList'

import s from './Header.module.scss'

type HeaderProps = {
  isLoginIn: boolean
  onLoginAction?: () => void
  onSignupAction?: () => void
}

export const Header = ({ isLoginIn, onLoginAction, onSignupAction }: HeaderProps) => {
  return (
    <div className={s.container}>
      <Typography as={'div'} variant={'large'} className={s.logo}>
        Inctagram
      </Typography>
      <div>
        {isLoginIn ? (
          <div className={s.authorized_notifications}>
            <ToolTip text={''}>
              <OutlineBellIcon />
            </ToolTip>
            <SelectBox options={SelectOption} defaultValue={'en'} width={'163px'} />
          </div>
        ) : (
          <div className={s.unauthorized_notifications}>
            <SelectBox options={SelectOption} defaultValue={'en'} width={'163px'} />
            <div className={s.button}>
              <Button as={'button'} variant={'link'} onClick={onLoginAction}>
                Log in
              </Button>
              <Button as={'button'} variant={'primary'} onClick={onSignupAction}>
                Sign up
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
