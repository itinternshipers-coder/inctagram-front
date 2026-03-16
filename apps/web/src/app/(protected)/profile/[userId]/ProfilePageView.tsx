'use client'

import type { Post } from '@/entities/post/model'
import { AuthContext } from '@/features/auth/providers/auth-context'
import type { Profile } from '@/features/profile/model/type'
import { ProfileHeader } from '@/features/profile/ui/ProfileHeader/ProfileHeader'
import { UserPostsList } from '@/features/profile/ui/UserPostsList/UserPostsList'
import { useParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

type Props = {
  profile: Profile['response']
  posts: Post[]
  userId: string
}

export const ProfilePageView = ({ profile, posts, userId }: Props) => {
  const { user, isLoggedIn } = useContext(AuthContext)
  const params = useParams()
  const userIdFromUrl = params.userId as string
  const isOwner = isLoggedIn && user?.userId === userIdFromUrl

  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (isLoggedIn && !isOwner) {
      // TODO: здесь (асинхронный) запрос статуса подписки
      // fetchFollowingStatus(userIdFromUrl).then(setIsFollowing)
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFollowing(false)
    }
  }, [isLoggedIn, isOwner, userIdFromUrl])

  const handleFollow = () => {
    // TODO: мутация подписки
    console.log('follow')
  }
  const handleUnfollow = () => {
    // TODO: мутация отписки
    console.log('unfollow')
  }
  const handleSendMessage = () => {
    // TODO: переход в мессенджер
    console.log('send message')
  }

  return (
    <>
      <ProfileHeader
        profile={profile}
        postsCount={posts.length}
        isOwner={isOwner}
        isFollowing={isFollowing}
        isLoggedIn={isLoggedIn}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onSendMessage={handleSendMessage}
      />
      <UserPostsList userId={userId} initialPosts={posts ?? []} initialTotalCount={posts.length ?? 0} />
    </>
  )
}
