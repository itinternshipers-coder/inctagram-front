'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import * as React from 'react'
import CheckmarkOutlineIcon from '../../icons/svgComponents/icons/CheckmarkOutlineIcon'
import s from './CheckBox.module.scss'

type CheckBoxProps = {
  checked: boolean
  disabled?: boolean
  name?: string
  onCheckedChange?: (checked: boolean) => void
}

export const CheckBox = ({ disabled, checked, name, onCheckedChange }: CheckBoxProps) => {
  return (
    <div className={s.wrapper}>
      <Checkbox.Root className={s.Root} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator className={s.Indicator}>{checked ? <CheckmarkOutlineIcon /> : ''}</Checkbox.Indicator>
      </Checkbox.Root>
      <label className={disabled ? s.LabelDisabled : s.Label}>{name}</label>
    </div>
  )
}
