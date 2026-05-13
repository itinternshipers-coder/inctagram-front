'use client'

import type { Post } from '@/entities/post/model'
import { AuthContext } from '@/features/auth/providers/auth-context'
import { useFollowUserMutation, useUnfollowUserMutation } from '@/features/following/api/following-api'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import type { Profile } from '@/features/profile/model/type'
import { ProfileHeader } from '@/features/profile/ui/ProfileHeader/ProfileHeader'
import { UserPostsList } from '@/features/profile/ui/UserPostsList/UserPostsList'
import { Alert } from '@/shared/ui/Alert/Alert'
import { useContext, useState } from 'react'

type Props = {
  profile: Profile['response']
  posts: Post[]
  userId: string
}

export const ProfilePageView = ({ profile, posts, userId }: Props) => {
  const { user, isLoggedIn } = useContext(AuthContext)
  const currentUserId = user?.userId
  const isOwner = isLoggedIn && currentUserId === userId
  const { data: actualProfile } = useGetProfileQuery(userId)
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation()
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation()
  const [followError, setFollowError] = useState<string | null>(null)

  const profileData = actualProfile ?? profile
  const isFollowActionPending = isFollowing || isUnfollowing

  const handleFollow = async () => {
    if (!currentUserId) {
      return
    }

    setFollowError(null)

    try {
      await followUser({ userId, currentUserId }).unwrap()
    } catch {
      setFollowError('Failed to follow user')
    }
  }

  const handleUnfollow = async () => {
    if (!currentUserId) {
      return
    }

    setFollowError(null)

    try {
      await unfollowUser({ userId, currentUserId }).unwrap()
    } catch {
      setFollowError('Failed to unfollow user')
    }
  }

  const handleSendMessage = () => {
    console.log('send message')
  }

  return (
    <>
      {followError && <Alert status="error" text={followError} position="bottom-left" autoDismiss={3000} />}
      <ProfileHeader
        profile={profileData}
        postsCount={posts.length}
        isOwner={isOwner}
        isLoggedIn={isLoggedIn}
        isFollowActionPending={isFollowActionPending}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onSendMessage={handleSendMessage}
      />
      <UserPostsList userId={userId} initialPosts={posts ?? []} initialTotalCount={posts.length ?? 0} />
    </>
  )
}
