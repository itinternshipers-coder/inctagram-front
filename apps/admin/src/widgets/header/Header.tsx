'use client'

import { SelectBox, Switch, Typography, FlagRussiaIcon, FlagUnitedKingdomIcon } from '@inctagram/ui'
import type { Option } from '@inctagram/ui'
import { useTheme } from '@/shared/providers/ThemeProvider'
import Link from 'next/link'
import s from './Header.module.scss'

const languageOptions: Option[] = [
  { value: 'ru', label: 'Russian', icon: <FlagRussiaIcon /> },
  { value: 'en', label: 'English', icon: <FlagUnitedKingdomIcon /> },
]

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className={s.container}>
      <Typography as={Link} href="/" variant="large">
        Inctagram
        <span className={s.superAdmin}>SuperAdmin</span>
      </Typography>
      <div className={s.actions}>
        <SelectBox options={languageOptions} defaultValue="en" width="163px" />
        <Switch checked={isDark} onCheckedChangeAction={toggleTheme} />
      </div>
    </header>
  )
}
