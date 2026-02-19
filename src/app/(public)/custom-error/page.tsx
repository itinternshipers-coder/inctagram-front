'use client'

import Loader from '@/shared/ui/Loader/Loader'
import { Typography } from '@/shared/ui/Typography/Typography'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react' // Добавить импорт

function CustomErrorContent() {
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

export default function CustomError() {
  return (
    <Suspense
      fallback={<Loader />}
    >
      <CustomErrorContent />
    </Suspense>
  )
}
