'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PaymentCancelPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/settings?success=false&part=account-management')
  }, [router])

  return null
}
