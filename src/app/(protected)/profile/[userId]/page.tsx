'use client'

import { use } from 'react'

type ProfilePageProps = {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ _postId?: string; _action?: string }>
}

export default function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { userId } = use(params)
  const { _postId, _action } = use(searchParams)

  return (
    <div>
      <h1>Профиль пользователя {userId}</h1>
    </div>
  )
}
