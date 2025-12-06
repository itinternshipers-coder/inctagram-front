'use client'

import { useEmailConfirmation } from '@/features/auth/lib/use-confirmation'
import { EmailConfirmation } from '@/features/auth/ui/EmailConfirmation/EmailConfirmation'

export default function EmailConfirmationPage() {
  const { email, isLoading, isSuccess, error } = useEmailConfirmation()

  // Показываем загрузку (заглушка пока нет спиннера)
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }

  if (!email) {
    return null
  }

  return <EmailConfirmation isSuccess={isSuccess} email={email} confirmError={error} />
}
