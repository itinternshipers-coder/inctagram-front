'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks'
import { authApi } from '../api/auth-api'

export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authApi.endpoints.me.initiate())
  }, [dispatch])
}
