'use client'
import { AuthContext } from '@/features/auth/providers/auth-context'
import { Feed } from '@/widgets/feed/Feed/Feed'
import { useContext } from 'react'

export const HomeContent = ({ guestContent }: { guestContent: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext)
  if (isLoading) return null
  return isLoggedIn ? <Feed /> : guestContent
}
