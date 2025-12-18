'use client'

import React from 'react'
import clsx from 'clsx'
import Sidebar from '@/widgets/Sidebar/Sidebar'
import { Header } from '@/widgets/header/Header'
import { useAuthInit } from '@/features/auth/lib/use-auth-init'
import { useMeQuery } from '@/features/auth/api/auth-api'
import { Card } from '@/shared/ui/Card/Card'
import { Typography } from '@/shared/ui/Typography/Typography'

import s from './AuthWrapper.module.scss'

type Props = {
  children: React.ReactNode
}

export const AuthWrapper = ({ children }: Props) => {
  useAuthInit()
  const { data: user, isLoading } = useMeQuery()

  const isLoggedIn = !!user

  if (isLoading) {
    return (
      <Card className={s.card}>
        <Typography variant="regular_text_16">...loading</Typography>
      </Card>
    )
  }

  return (
    <>
      <Header isLoginIn={isLoggedIn} />
      <div className={s.contentWrapper}>
        {isLoggedIn && <Sidebar role="user" />}
        <div className={s.contentBlock}>
          <div className={clsx(s.children, !isLoggedIn && s.childrenWithoutSidebar)}>{children}</div>
        </div>
      </div>
    </>
  )
}
