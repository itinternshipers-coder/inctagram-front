'use client'

import { useGetPostByIdQuery } from '@/entities/post/api/posts-api'
import PostModal from '@/shared/ui/PostModal/PostModal'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { useParams, useRouter } from 'next/navigation'

export default function PostModalClient() {
  const { postId } = useParams<{ postId: string }>()
  const { data, isLoading, error } = useGetPostByIdQuery(postId ? { id: postId } : skipToken)
  const router = useRouter()
  if (isLoading) return null
  if (error || !data) return null

  return <PostModal postData={data} open={true} onOpenChange={() => router.back()} comments={[]} />
}
