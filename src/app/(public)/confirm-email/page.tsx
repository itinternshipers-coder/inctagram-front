'use client'

import { EmailConfirmation } from '@/features/auth/ui/EmailConfirmation/EmailConfirmation'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useConfirmEmailMutation } from '@/features/auth/api/auth-api'

export default function EmailConfirmationPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const email = searchParams.get('email')
  const [confirmEmail] = useConfirmEmailMutation()

  useEffect(() => {
    if (code) {
      setStatus('loading')
      confirmEmail({ confirmationCode: code })
        .unwrap()
        .then(() => {
          setStatus('success')
        })
        .catch((error) => {
          console.error('Confirmation error:', error)
          setStatus('error')
        })
    } else {
      setStatus('error')
    }
  }, [code, confirmEmail])

  // Показываем загрузку
  if (status === 'idle' || status === 'loading') {
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

  return <EmailConfirmation isSuccess={status === 'success'} email={email} />
}
