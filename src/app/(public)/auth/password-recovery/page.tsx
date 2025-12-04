'use client'

import { useRouter } from 'next/navigation'

export default function PasswordRecoveryPage() {
  const router = useRouter()

  const isSuccess = true

  if (isSuccess) {
    router.replace('/create-new-password') // если ссылка рабочая - редирект на create-new-password
    return null
  }
}
