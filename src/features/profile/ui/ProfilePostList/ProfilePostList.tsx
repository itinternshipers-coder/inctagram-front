'use client'

import { Post } from '@/entities/post/model'
import { PostCard } from '@/entities/post/ui/PostCard/PostCard'
import { Profile } from '@/features/profile/model/type'
import { formatTimeAgo } from '@/shared/lib/formatTimeAgo'
import s from './ProfilePostList.module.scss'

type Props = {
  profile: Profile['response']
  posts: Post[]
}

export const ProfilePostList = ({ profile, posts }: Props) => {
  const userProfileImage = profile.avatar?.[0]?.url || 'https://placehold.co/100?text=User'
  const userName = `${profile.firstName} ${profile.lastName}`.trim() || profile.username

  if (posts.length === 0) {
    return <p className={s.empty}>No posts yet</p>
  }

  return (
    <div className={s.grid}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          photos={post.photos}
          userProfileImage={userProfileImage}
          userName={userName}
          timeAgo={formatTimeAgo(post.createdAt)}
          description={post.description}
        />
      ))}
    </div>
  )
}
