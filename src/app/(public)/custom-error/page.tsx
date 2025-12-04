'use client'

import { Typography } from '@/shared/ui/Typography/Typography'
import { useSearchParams } from 'next/navigation'

export default function CustomError() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography as={'h1'} variant={'large'}>
        {message || 'Not Found!'}
      </Typography>
    </div>
  )
}
