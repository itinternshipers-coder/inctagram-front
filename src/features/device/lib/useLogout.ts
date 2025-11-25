import { useRouter } from 'next/navigation'
import { useDeleteSessionMutation, useGetSessionsQuery } from '../api/device-api'
import { useCallback } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks'
import { logout as logoutAction } from '@/features/auth/model/auth-slice'

export const useLogout = () => {
  const route = useRouter()
  const dispatch = useAppDispatch()
  const [deleteSession] = useDeleteSessionMutation()
  const { data: sessions } = useGetSessionsQuery()

  const logout = useCallback(async () => {
    try {
      if (!sessions) return
      await deleteSession(sessions.current.deviceId).unwrap()
      dispatch(logoutAction())
      route.push('/')
    } catch (e) {
      console.error(e)
    }
  }, [sessions, deleteSession, route, dispatch])

  return { logout }
}
