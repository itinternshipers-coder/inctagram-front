'use client'

type ProfilePageProps = {
  params: { userId: string }
  searchParams: { postId?: string; action?: string }
}

export default function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { userId } = params
  const { postId, action } = searchParams

  return (
    <div>
      <h1>Профиль пользователя {userId}</h1>
    </div>
  )
}
