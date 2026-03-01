'use client'
import { ReactNode } from 'react'
import { useMeQuery } from '../api/auth-api'
import { AuthContext } from './auth-context'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isFetching, error, isError } = useMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  })

  const shouldShowLoading = isLoading && !isError

  const user = isError ? null : data || null
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading: shouldShowLoading,
        isFetching,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
