'use client'

import { AuthContext } from '@/features/auth/providers/auth-context'
import { ROUTES } from '@/shared/config/routes'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'

export default function ProfileRedirect() {
  const { user, isLoading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (user?.userId) {
      router.replace(ROUTES.DYNAMIC.PROFILE(user.userId))
    } else {
      router.replace(ROUTES.PUBLIC.SIGN_IN)
    }
  }, [user, isLoading, router])

  return null // Или минимальный loader
}
