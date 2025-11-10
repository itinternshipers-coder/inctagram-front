'use client'

import { clsx } from 'clsx'
import { type ComponentPropsWithoutRef, type ElementType } from 'react'
import * as React from 'react'
import s from './Card.module.scss'

type Props<T extends ElementType = 'div'> = {
  as?: T
} & ComponentPropsWithoutRef<T>
export const Card = ({ as = 'div', className, ...rest }: Props) => {
  const Component = as

  return <Component className={clsx(s.root, className)} {...rest} />
}
