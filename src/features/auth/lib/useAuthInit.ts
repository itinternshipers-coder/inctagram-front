'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks'
import { setAccessToken } from '../model/auth-slice'
import { authApi } from '../api/auth-api'

export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('accessToken')
    if (token) {
      dispatch(setAccessToken(token))
      dispatch(authApi.endpoints.me.initiate(undefined))
    }
  }, [dispatch])
}
