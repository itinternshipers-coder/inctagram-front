'use client'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/features/auth/providers/auth-context'
import { ProfileHeader } from '@/features/profile/ui/ProfileHeader/ProfileHeader'
import { ProfilePostList } from '@/features/profile/ui/ProfilePostList/ProfilePostList'
import type { Profile } from '@/features/profile/model/type'
import type { Post } from '@/entities/post/model'
import { useParams } from 'next/navigation'

type Props = {
  profile: Profile['response']
  posts: Post[]
}

export const ProfilePageView = ({ profile, posts }: Props) => {
  const { user, isLoggedIn } = useContext(AuthContext)
  const params = useParams()
  const userIdFromUrl = params.userId as string

  const [isOwner, setIsOwner] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (isLoggedIn && user?.userId) {
      const owner = user.userId === userIdFromUrl
      setIsOwner(owner)
      // Если не владелец, запрос за статусом подписки (заглушка)
      if (!owner) {
        // TODO: fetch following status
        // Для примера пока false
        setIsFollowing(false)
      }
    } else {
      setIsOwner(false)
      setIsFollowing(false)
    }
  }, [isLoggedIn, user, userIdFromUrl])

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
      <ProfilePostList profile={profile} posts={posts} />
    </>
  )
}
