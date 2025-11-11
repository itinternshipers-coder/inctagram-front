'use client'

type ProfilePageProps = {
  params: { userId: string }
  searchParams: { _postId?: string; _action?: string }
}

export default function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { userId } = params
  const { _postId, _action } = searchParams

  return (
    <div>
      <h1>Профиль пользователя {userId}</h1>
    </div>
  )
}
