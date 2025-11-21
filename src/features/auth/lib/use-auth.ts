import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { useCallback } from 'react'
import { useLoginMutation, useLogoutMutation, useMeQuery } from '../api/auth-api'
import { logout, setAccessToken, setUser } from '../model/auth-slice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  const [loginMutation] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()

  const { data: userData, refetch: refetchMe } = useMeQuery(undefined, {
    skip: true,
  })

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const result = await loginMutation(credentials).unwrap()
        dispatch(setAccessToken(result.accessToken))

        const userResult = await refetchMe().unwrap()

        if (userResult) {
          dispatch(setUser(userResult))
        }

        return result
      } catch (error) {
        throw error
      }
    },
    [dispatch, loginMutation, refetchMe] // ← добавил refetchMe в зависимости
  )
  const logoutUser = useCallback(async () => {
    try {
      await logoutMutation().unwrap()
    } finally {
      dispatch(logout())
    }
  }, [dispatch, logoutMutation])

  return {
    ...auth,
    login,
    logout: logoutUser,
    refetchMe,
    userData,
  }
}
