'use client'

import { Switch, ToolTip } from '@inctagram/ui'
import { useTheme } from '@/shared/providers/ThemeProvider'

type Props = {
  className?: string
}

export const ThemeSwitch = ({ className }: Props) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <ToolTip text={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      <Switch className={className} checked={isDark} onCheckedChangeAction={toggleTheme} />
    </ToolTip>
  )
}
