'use client'
import { ReactNode } from 'react'
import { useMeQuery } from '../api/auth-api'
import { AuthContext } from './auth-context'
import { Loader } from '@/shared/ui/Loader/Loader'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isFetching, error } = useMeQuery()

  if (isLoading || isFetching) {
    return <Loader />
  }
  // Пояснение:
  // - error === true означает, что последний запрос завершился с ошибкой
  // - isFetching === false означает, что в текущий момент нет активных запросов для этого hook
  // Если есть ошибка и в данный момент нет активных фетчей — это финальная ошибка (final error).
  // В этом случае мы не должны опираться на застаревший data из кеша, а считать пользователя гостем.
  const isFinalError = !!error && !isFetching
  const user = isFinalError ? null : (data ?? null)
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
