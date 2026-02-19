'use client'
import React, { ReactNode, useContext } from 'react'
import { AuthContext } from '@/features/auth/providers/auth-context'
import { Header } from '@/widgets/header/Header'
import Sidebar from '@/widgets/Sidebar/Sidebar'
import { Loader } from '@/shared/ui/Loader/Loader'
import s from './AuthWrapper.module.scss'

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, isLoading, isFetching } = useContext(AuthContext)

  if (isLoading || isFetching) {
    return <Loader />
  }

  return (
    <>
      <Header isLoginIn={isLoggedIn} />
      <div className={s.contentWrapper}>
        {isLoggedIn && <Sidebar role="user" />}
        <div className={s.contentBlock}>
          <div className={!isLoggedIn ? s.childrenWithoutSidebar : ''}>{children}</div>
        </div>
      </div>
    </>
  )
}
