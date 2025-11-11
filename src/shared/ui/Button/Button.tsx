'use client'

import React, { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import clsx from 'clsx'
import s from './Button.module.scss' // абсолютный путь

export type Props<T extends ElementType = 'button'> = {
  as?: T
  children: ReactNode
  className?: string
  fullWidth?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
} & ComponentPropsWithoutRef<T>

export const Button = <T extends ElementType = 'button'>(props: Props<T>) => {
  const { as: Component = 'button', className, fullWidth, variant = 'primary', disabled, ...rest } = props

  const isLink = variant === 'link' && Component === 'a'

  const classes = clsx(s.button, s[variant], fullWidth && s.fullWidth, isLink && disabled && s.linkDisabled, className)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled && isLink) e.preventDefault()
    rest.onClick?.(e)
  }

  return <Component className={classes} {...rest} disabled={!isLink ? disabled : undefined} onClick={handleClick} />
}
