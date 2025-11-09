'use client'

import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { clsx } from 'clsx'
import s from './Typography.module.scss'

export type TypographyProps<T extends ElementType> = {
  as?: T
  children?: ReactNode
  className?: string
  variant?:
    | 'large'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'regular_text_16'
    | 'bold_text_16'
    | 'regular_text_14'
    | 'medium_text_14'
    | 'bold_text_14'
    | 'small_text'
    | 'semi_bold_small_text'
    | 'regular_link'
    | 'small_link'
}

export function Typography<T extends ElementType = 'p'>({
  as,
  className,
  variant = 'regular_text_16',
  ...restProps
}: Omit<ComponentPropsWithoutRef<T>, keyof TypographyProps<T>> & TypographyProps<T>) {
  const classNames = clsx(s.typography, s[variant], className)
  const Component = as || 'p'

  return <Component className={classNames} {...restProps} />
}
