'use client'

import SignInForm from '@/app/features/auth/ui/SignInForm/SignInForm'

export default function LoginPage() {
  return (
    <div className={''} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignInForm />
    </div>
  )
}
