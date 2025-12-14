'use client'
import { formatTimeAgo } from '@/shared/lib/formatTimeAgo'
import { Post } from '../../model'
import { PostCard } from '../PostCard/PostCard'
import s from './PostList.module.scss'

type Props = {
  posts: Post[]
}

const PostList = () => {
  const postMocks: Post[] = [
    {
      id: '1',
      authorId: 'user-001',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      createdAt: '2025-12-14T10:00:00Z',
      updatedAt: '2025-12-14T10:00:00Z',
      deletedAt: null,
      photos: [
        {
          id: 'photo-1-1',
          photoId: 'p1',
          s3Key: 'posts/1/photo1.jpg',
          url: 'https://i.ytimg.com/vi/uQrbvl5XV_k/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD4QVzrxmoaL5RSs6QH1onHd92iPg',
          order: 1,
          createdAt: '2025-12-14T10:00:00Z',
        },
        {
          id: 'photo-1-2',
          photoId: 'p2',
          s3Key: 'posts/1/photo2.jpg',
          url: 'https://kartinki.pibig.info/uploads/posts/2023-03/1680194537_kartinki-pibig-info-p-krasivie-kvadratnie-kartinki-arti-2.jpg',
          order: 2,
          createdAt: '2025-12-14T10:00:00Z',
        },
        {
          id: 'photo-1-3',
          photoId: 'p3',
          s3Key: 'posts/1/photo1.jpg',
          url: 'https://kartinki.pics/uploads/posts/2022-12/thumbs/1671757770_kartinkin-net-p-krasivie-kvadratnie-kartinki-krasivo-2.jpg',
          order: 3,
          createdAt: '2025-12-14T10:00:00Z',
        },
        {
          id: 'photo-1-4',
          photoId: 'p4',
          s3Key: 'posts/1/photo1.jpg',
          url: 'https://i.ytimg.com/vi/uQrbvl5XV_k/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD4QVzrxmoaL5RSs6QH1onHd92iPg',
          order: 4,
          createdAt: '2025-12-14T10:00:00Z',
        },
      ],
    },
    {
      id: '2',
      authorId: 'user-002',
      description: 'Another post with a single image. Perfect for testing layout and text clamping.',
      createdAt: '2025-12-14T09:30:00Z',
      updatedAt: '2025-12-14T09:30:00Z',
      deletedAt: null,
      photos: [
        {
          id: 'photo-2-1',
          photoId: 'p3',
          s3Key: 'posts/2/main.jpg',
          url: 'https://i.7fon.org/450/b174614.jpg',
          order: 1,
          createdAt: '2025-12-14T09:30:00Z',
        },
      ],
    },
    {
      id: '3',
      authorId: 'user-003',
      description: 'Short post.',
      createdAt: '2025-12-14T08:15:00Z',
      updatedAt: '2025-12-14T08:15:00Z',
      deletedAt: null,
      photos: [
        {
          id: 'photo-3-1',
          photoId: 'p4',
          s3Key: 'posts/3/shot.jpg',
          url: 'https://i.7fon.org/450/b174614.jpg',
          order: 1,
          createdAt: '2025-12-14T08:15:00Z',
        },
      ],
    },
  ]

  return (
    <div className={s.postList}>
      {postMocks.map((post) => (
        <PostCard
          key={post.id}
          photos={post.photos}
          userProfileImage={'https://placehold.co/100?text=User'}
          userName={post.id}
          timeAgo={formatTimeAgo(post.createdAt)}
          description={post.description}
        />
      ))}
    </div>
  )
}

export default PostList
