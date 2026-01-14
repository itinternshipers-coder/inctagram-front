'use client'
import { formatTimeAgo } from '@/shared/lib/formatTimeAgo'
import { Post } from '../../model'
import { PostCard } from '../PostCard/PostCard'
import s from './PostList.module.scss'

type Props = {
  posts: Post[]
}

export const PostList = ({ posts }: Props) => {
  return (
    <div className={s.postList}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          photos={post.photos}
          //пока нет profiles API slice передаём моковые данные
          userProfileImage={'https://placehold.co/100?text=User'}
          userName={'userName'}
          timeAgo={formatTimeAgo(post.createdAt)}
          description={post.description}
        />
      ))}
    </div>
  )
}
