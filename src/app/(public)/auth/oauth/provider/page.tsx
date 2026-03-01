'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMeQuery } from '@/features/auth/api/auth-api'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { setAccessToken } from '@/features/auth/model/auth-slice'
import { ROUTES } from '@/shared/config/routes'
import { Loader } from '@/shared/ui/Loader/Loader'

export default function OAuthProviderCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const accessTokenInStore = useAppSelector((state) => state.auth.accessToken)
  const processed = useRef(false)

  const tokenFromUrl = searchParams?.get('access_token') ?? null

  const {
    data: user,
    isLoading,
    isError,
  } = useMeQuery(undefined, {
    skip: !accessTokenInStore,
  })

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    if (!tokenFromUrl) {
      router.replace(ROUTES.PUBLIC.SIGN_IN)
      return
    }

    dispatch(setAccessToken(tokenFromUrl))
    router.replace('/auth/oauth/provider', { scroll: false })
  }, [tokenFromUrl, dispatch, router])

  useEffect(() => {
    if (!accessTokenInStore || isLoading) return

    if (user) {
      router.replace(ROUTES.PROTECTED.PROFILE)
    } else if (isError) {
      dispatch(setAccessToken(null))
      router.replace(ROUTES.PUBLIC.SIGN_IN)
    }
  }, [user, isLoading, isError, router, accessTokenInStore, dispatch])

  return <Loader />
}
