import { Suspense } from 'react'
import OAuthHandler from './OAuthHandler'
import { Loader } from '@inctagram/ui'

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <OAuthHandler />
    </Suspense>
  )
}
