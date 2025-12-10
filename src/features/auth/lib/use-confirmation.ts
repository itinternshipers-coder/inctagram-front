import { normalizeError } from '@/shared/api/error-utils'
import { ROUTES } from '@/shared/config/routes'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useConfirmEmailMutation } from '../api/auth-api'
import { z } from 'zod'

export const useEmailConfirmation = () => {
  const [confirmEmail, { isLoading, isSuccess, isError, error, reset }] = useConfirmEmailMutation()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const email = searchParams.get('email')
  const router = useRouter()

  const Params = z.object({
    code: z.string().min(1),
    email: z.email(),
  })

  useEffect(() => {
    const result = Params.safeParse({ code, email })

    if (!result.success) {
      //редирект на станицу ошибки если нет каких-то квери
      router.replace(
        `${ROUTES.PUBLIC.CUSTOM_ERROR}?message=${encodeURIComponent('The confirmation link is invalid or expired')}`
      )
      return
    }

    confirmEmail({ confirmationCode: result.data.code }).unwrap()

    return () => reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, email])

  return {
    code,
    email,
    isLoading,
    isSuccess,
    isError,
    error: normalizeError(error),
  }
}
