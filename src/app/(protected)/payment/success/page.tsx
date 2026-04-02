'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const orderId = searchParams.get('session_id') || searchParams.get('token') || ''

    router.replace(`/settings?success=true&orderId=${orderId}&part=account-management`)
  }, [searchParams, router])

  return null
}
