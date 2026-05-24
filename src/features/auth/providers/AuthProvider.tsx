'use client'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useMeQuery, useRefreshTokenMutation } from '../api/auth-api'
import { AuthContext } from './auth-context'
import { Loader } from '@/shared/ui/Loader/Loader'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { setAccessToken } from '../model/auth-slice'

const OAUTH_CALLBACK_PATH = '/auth/oauth/'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const isOAuthCallback = pathname?.startsWith(OAUTH_CALLBACK_PATH) ?? false
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)

  const { data, isLoading, isFetching, error } = useMeQuery(undefined, {
    skip: isOAuthCallback,
  })
  const [refreshToken] = useRefreshTokenMutation()

  useEffect(() => {
    if (isOAuthCallback || !data || accessToken) {
      return
    }

    let isCancelled = false

    void refreshToken()
      .unwrap()
      .then((result) => {
        if (!isCancelled) {
          dispatch(setAccessToken(result.accessToken))
        }
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [accessToken, data, dispatch, isOAuthCallback, refreshToken])

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
