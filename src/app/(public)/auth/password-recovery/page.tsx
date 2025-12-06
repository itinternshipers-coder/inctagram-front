'use client'

import { usePasswordRecovery } from '@/features/auth/lib/use-password-recovery'
import { PasswordRecovery } from '@/features/auth/ui/PasswordRecovery/PasswordRecovery'

export default function PasswordRecoveryPage() {
  const { recoveryCode, email, isLoading, data, error } = usePasswordRecovery()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    )
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
