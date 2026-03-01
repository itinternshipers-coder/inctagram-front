'use client'

import { useGetPostByIdQuery } from '@/entities/post/api/posts-api'
import PostModal from '@/shared/ui/PostModal/PostModal'
import { useParams, useRouter } from 'next/navigation'

export default function PostModalClient() {
  const { postId } = useParams<{ postId: string }>()
  const { data, isLoading, error } = useGetPostByIdQuery({ id: postId })
  const router = useRouter()
  if (isLoading) return null
  if (error || !data) return null

  return <PostModal postData={data.item} open={true} onOpenChange={() => router.back()} comments={[]} />
}
