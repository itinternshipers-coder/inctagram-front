'use client'

import { Switch } from '@/shared/ui/Switch/Switch'
import ToolTip from '@/shared/ui/ToolTip/ToolTip'
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
