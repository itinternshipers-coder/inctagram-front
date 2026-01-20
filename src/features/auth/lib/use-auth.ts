import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useLoginMutation, useLogoutMutation } from '../api/auth-api'
import { logout, setAccessToken } from '../model/auth-slice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)

  const [loginMutation] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const result = await loginMutation(credentials).unwrap()

        dispatch(setAccessToken(result.accessToken))

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
    } finally {
      dispatch(logout())
      router.push('/login')
    }
  }, [dispatch, logoutMutation, router])

  return {
    ...auth,
    login,
    logout: logoutUser,
  }
}
