'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')

    if (!token) {
      router.replace('/sign-in')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
