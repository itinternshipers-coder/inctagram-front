'use client'
import { useGetUserPostsQuery } from '@/entities/post/api/posts-api'
import { Post } from '@/entities/post/model'

type Props = {
  userId: string
}

export const UserPostsList = ({ userId }: Props) => {
  const { data, isLoading, isError } = useGetUserPostsQuery({ userId, pageSize: '8', sortDirection: 'desc' })
  const posts = data?.items ?? []

  if (isLoading) {
    return <div>Loading posts...</div>
  }

  if (isError) {
    return <div>Error loading posts</div>
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post: Post) => (
          <div key={post.id}>
            {post.photos?.[0]?.url ? (
              <img src={post.photos[0].url} alt={post.description || 'Post'} />
            ) : (
              <div>
                <span>{post.description?.substring(0, 50) || 'No description'}...</span>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No posts yet</p>
      )}
    </div>
  )
}
