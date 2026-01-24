'use client'
import React, { useContext } from 'react'
import clsx from 'clsx'
import { Header } from '@/widgets/header/Header'
import Sidebar from '@/widgets/Sidebar/Sidebar'
import { AuthContext } from '@/features/auth/providers/auth-context'
import s from './AuthWrapper.module.scss'

type Props = {
  children: React.ReactNode
}

export const AuthWrapper = ({ children }: Props) => {
  const { isLoggedIn } = useContext(AuthContext)

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
