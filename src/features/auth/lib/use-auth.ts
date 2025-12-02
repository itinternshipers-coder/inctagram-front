// src/features/auth/lib/useAuth.ts
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useLoginMutation, useLogoutMutation } from '../api/auth-api'
import { logout, setAccessToken, setUser } from '../model/auth-slice'
import { authApi } from '../api/auth-api'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const route = useRouter()
  const auth = useAppSelector((state) => state.auth)

  const [loginMutation] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const result = await loginMutation(credentials).unwrap()

        dispatch(setAccessToken(result.accessToken))
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', result.accessToken)
        }

        const userResult = await dispatch(authApi.endpoints.me.initiate(undefined, { forceRefetch: true })).unwrap()

        if (userResult) {
          dispatch(setUser(userResult))
        }

        return result
      } catch (error) {
        dispatch(logout())
        throw error
      }
    },
    [dispatch, loginMutation]
  )

  const logoutUser = useCallback(async () => {
    try {
      await logoutMutation().unwrap()
    } catch (e) {
      console.error(e)
    } finally {
      dispatch(logout())
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }
      route.push('/login')
    }
  }, [dispatch, logoutMutation, route])

  return {
    ...auth,
    login,
    logout: logoutUser,
  }
}
