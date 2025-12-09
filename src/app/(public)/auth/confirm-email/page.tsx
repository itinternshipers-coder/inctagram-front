'use client'

import { useEmailConfirmation } from '@/features/auth/lib/use-confirmation'
import { EmailConfirmation } from '@/features/auth/ui/EmailConfirmation/EmailConfirmation'
import { Suspense } from 'react'

function EmailConfirmationContent() {
  const { email, isLoading, isSuccess, error } = useEmailConfirmation()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!email) {
    return null
  }

  return <EmailConfirmation isSuccess={isSuccess} email={email} confirmError={error} />
}

export default function EmailConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          Loading...
        </div>
      }
    >
      <EmailConfirmationContent />
    </Suspense>
  )
}
