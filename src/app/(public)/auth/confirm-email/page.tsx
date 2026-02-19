'use client'

import { useEmailConfirmation } from '@/features/auth/lib/use-confirmation'
import { EmailConfirmation } from '@/features/auth/ui/EmailConfirmation/EmailConfirmation'
import Loader from '@/shared/ui/Loader/Loader'
import { Suspense } from 'react'

function EmailConfirmationContent() {
  const { email, isLoading, isSuccess, error } = useEmailConfirmation()

  if (isLoading) {
    return <Loader />
  }

  if (!email) {
    return null
  }

  return <EmailConfirmation isSuccess={isSuccess} email={email} confirmError={error} />
}

export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={<Loader />}>
      <EmailConfirmationContent />
    </Suspense>
  )
}
