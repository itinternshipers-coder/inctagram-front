'use client'
import React, { ReactNode, useContext } from 'react'
import clsx from 'clsx'
import { Header } from '@/widgets/header/Header'
import Sidebar from '@/widgets/Sidebar/Sidebar'
import { AuthContext } from '@/features/auth/providers/auth-context'
import { ClientOnly } from '@/shared/ui/ClientOnly/ClientOnly'
import s from './AuthWrapper.module.scss'

type Props = {
  children: ReactNode
}

export const AuthWrapper = ({ children }: Props) => {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <>
      <ClientOnly skeletonHeight="60px">
        <Header isLoginIn={isLoggedIn} />
      </ClientOnly>

      <div className={s.contentWrapper}>
        <ClientOnly skeletonWidth="240px" skeletonHeight="100vh">
          {isLoggedIn && <Sidebar role="user" />}
        </ClientOnly>

        <div className={s.contentBlock}>
          <div className={clsx(s.children, !isLoggedIn && s.childrenWithoutSidebar)}>{children}</div>
        </div>
      </div>
    </>
  )
}
