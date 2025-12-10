'use client'

import React from 'react'
import clsx from 'clsx'
import s from './AuthWrapper.module.scss'
import Sidebar from '@/widgets/Sidebar/Sidebar'
import { Header } from '@/widgets/header/Header'
import { useAuth } from '@/features/auth/lib/use-auth'
import { useAuthInit } from '@/features/auth/lib/use-auth-init'

type Props = {
  children: React.ReactNode
}

export const AuthWrapper = ({ children }: Props) => {
  const { accessToken } = useAuth()
  const isLoggedIn = !!accessToken
  useAuthInit()
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
