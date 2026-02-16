'use client'

import { useGetUserPostsQuery, useLazyGetUserPostsQuery } from '@/entities/post/api/posts-api'
import { Post } from '@/entities/post/model'
import { useCallback, useMemo, useState } from 'react'

type Props = {
  userId: string
}

const PAGE_SIZE = '8'
const EMPTY_POSTS: Post[] = []

export const UserPostsList = ({ userId }: Props) => {
  const { data, isLoading, isError } = useGetUserPostsQuery({
    userId,
    pageSize: PAGE_SIZE,
    sortDirection: 'desc',
  })

  const [extraPosts, setExtraPosts] = useState<Post[]>([])
  const [fetchNextPosts, { isFetching: isFetchingMore }] = useLazyGetUserPostsQuery()

  const basePosts = useMemo(() => data?.items ?? EMPTY_POSTS, [data?.items])

  const allPosts = useMemo(() => {
    const seen = new Set<string>()
    const merged: Post[] = []

    for (const post of [...basePosts, ...extraPosts]) {
      if (!seen.has(post.id)) {
        seen.add(post.id)
        merged.push(post)
      }
    }

    return merged
  }, [basePosts, extraPosts])

  const cursor = allPosts.length > 0 ? allPosts[allPosts.length - 1].id : null
  const hasMore = data ? data.totalCount > allPosts.length : false

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || !cursor || isFetchingMore) {
      return
    }

    try {
      const nextPage = await fetchNextPosts({
        userId,
        cursor,
        pageSize: PAGE_SIZE,
        sortDirection: 'desc',
      }).unwrap()

      if (!nextPage.items.length) {
        return
      }

      setExtraPosts((prev) => {
        const existing = new Set([...basePosts, ...prev].map((post) => post.id))
        const uniqueNewPosts = nextPage.items.filter((post) => !existing.has(post.id))

        return [...prev, ...uniqueNewPosts]
      })
    } catch (error) {
      console.error('Failed to load more posts:', error)
    }
  }, [basePosts, cursor, fetchNextPosts, hasMore, isFetchingMore, userId])

  if (isLoading) {
    return <div>Loading posts...</div>
  }

  if (isError) {
    return <div>Error loading posts</div>
  }

  return (
    <div>
      {allPosts.length > 0 ? (
        <div>
          {allPosts.map((post) => (
            <div key={post.id}>
              {post.photos?.[0]?.url ? (
                <img src={post.photos[0].url} alt={post.description || 'Post'} />
              ) : (
                <div>
                  <span>{post.description?.substring(0, 50) || 'No description'}...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No posts yet</p>
      )}

      {hasMore && (
        <button type="button" onClick={handleLoadMore} disabled={isFetchingMore} style={{ color: 'blue', marginTop: '10px' }}>
          {isFetchingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  )
}
