import { FlagRussiaIcon, FlagUnitedKingdomIcon } from '@inctagram/ui'
import * as React from 'react'

type SelectOption = {
  value: string
  label: string
  icon?: React.ReactNode
}

export const SelectOption: SelectOption[] = [
  {
    value: 'ru',
    label: 'Russian',
    icon: <FlagRussiaIcon />,
  },
  {
    value: 'en',
    label: 'English',
    icon: <FlagUnitedKingdomIcon />,
  },
]
