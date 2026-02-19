'use client'
import { useContext } from 'react'
import { AuthContext } from '@/features/auth/providers/auth-context'
import { Header } from '@/widgets/header/Header'
import Sidebar from '@/widgets/Sidebar/Sidebar'
import { Loader } from '@/shared/ui/Loader/Loader'
import s from './AuthWrapper.module.scss'

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext)

  if (isLoading) {
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
