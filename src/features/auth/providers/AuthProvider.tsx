'use client'
import { ReactNode } from 'react'
import { useMeQuery } from '../api/auth-api'
import { AuthContext } from './auth-context'
import { Loader } from '@/shared/ui/Loader/Loader'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error } = useMeQuery(undefined, {
    // Если в запросе произошла ошибка (любая, включая 401),
    // возвращаем null вместо данных пользователя
    selectFromResult: ({ data, isLoading, error }) => ({
      data: error ? null : data,
      isLoading,
      error,
    }),
  })

  const user = data || null
  const isLoggedIn = !!user

  if (isLoading) {
    return <Loader />
  }

  if (error && 'status' in error && error.status !== 401) {
    console.error('Auth error:', error)
  }

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
