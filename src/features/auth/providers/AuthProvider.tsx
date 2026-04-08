'use client'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useMeQuery } from '../api/auth-api'
import { AuthContext } from './auth-context'
import { Loader } from '@/shared/ui/Loader/Loader'

const OAUTH_CALLBACK_PATH = '/auth/oauth/'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const isOAuthCallback = pathname?.startsWith(OAUTH_CALLBACK_PATH) ?? false

  const { data, isLoading, isFetching, error } = useMeQuery(undefined, {
    skip: isOAuthCallback,
  })

  if (isOAuthCallback) {
    return (
      <AuthContext.Provider value={{ user: null, isLoggedIn: false, isLoading: false, isFetching: false }}>
        {children}
      </AuthContext.Provider>
    )
  }

  if (isLoading) {
    return <Loader />
  }

  const isFinalError = !!error && !isFetching
  const user = isFinalError ? null : (data ?? null)
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        isFetching,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
