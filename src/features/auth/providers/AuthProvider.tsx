'use client'
import { ReactNode } from 'react'
import { useMeQuery } from '../api/auth-api'
import { AuthContext } from './auth-context'
import { Loader } from '@/shared/ui/Loader/Loader'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error } = useMeQuery()

  const user = data || null

  if (isLoading) {
    return <Loader />
  }

  if (error && 'status' in error && error.status !== 401) {
    console.error('Auth error:', error)
  }

  const isLoggedIn = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
