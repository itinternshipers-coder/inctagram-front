'use client'
import { ReactNode, useContext } from 'react'
import { AuthContext } from '@/features/auth/providers/auth-context'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'

type ClientOnlyProps = {
  children: ReactNode
  skeleton?: ReactNode
  skeletonWidth?: string | number
  skeletonHeight?: string | number
}

export const ClientOnly = ({ children, skeleton, skeletonWidth, skeletonHeight }: ClientOnlyProps) => {
  const { isLoading } = useContext(AuthContext)

  if (isLoading) {
    return skeleton || <Skeleton width={skeletonWidth} height={skeletonHeight} />
  }

  return <>{children}</>
}
