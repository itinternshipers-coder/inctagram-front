'use client'

import { usePasswordRecovery } from '@/features/auth/lib/use-password-recovery'
import { PasswordRecovery } from '@/features/auth/ui/PasswordRecovery/PasswordRecovery'
import Loader from '@/shared/ui/Loader/Loader'
import { Suspense } from 'react'

function PasswordRecoveryContent() {
  const { recoveryCode, email, isLoading, data, error } = usePasswordRecovery()

  if (isLoading) {
    return <Loader />
  }

  if (!recoveryCode) {
    return null
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <PasswordRecovery recoveryCode={recoveryCode} email={email} data={data} error={error} />
    </div>
  )
}

export default function PasswordRecoveryPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PasswordRecoveryContent />
    </Suspense>
  )
}
