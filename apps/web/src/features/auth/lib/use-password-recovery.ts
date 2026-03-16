'use client'

import { useVerifyRecoveryCodeQuery } from '@/features/auth/api/password-api'
import { normalizeError } from '@/shared/api/error-utils'
import { ROUTES } from '@/shared/config/routes'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const usePasswordRecovery = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const recoveryCode = searchParams.get('code') || ''
  const email = searchParams.get('email') || ''

  const { data, isLoading, error } = useVerifyRecoveryCodeQuery({ code: recoveryCode }, { skip: !recoveryCode })

  useEffect(() => {
    if (!recoveryCode) {
      router.replace(`${ROUTES.PUBLIC.CUSTOM_ERROR}?message=Missing recovery code`)
    }
  }, [recoveryCode, router])

  return {
    recoveryCode,
    email,
    data,
    isLoading,
    error: normalizeError(error),
  }
}
