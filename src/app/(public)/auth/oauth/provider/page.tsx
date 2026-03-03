import { Suspense } from 'react'
import OAuthHandler from './OAuthHandler'
import { Loader } from '@/shared/ui/Loader/Loader'

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <OAuthHandler />
    </Suspense>
  )
}
