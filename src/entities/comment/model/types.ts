import type { ErrorResponse, AuthoriseError } from '@/shared/api/types'

/**
 * Комментарий или ответ на комментарий.
 * Replies отличаются ненулевым `parentCommentId` — UI группирует по нему,
 * глубокая вложенность не используется.
 *
 * Бэк отдаёт `userName` (camelCase), а не `username` — важно не перепутать.
 */
export type Comment = {
  id: string
  postId: string
  content: string
  authorId: string
  userName: string
  avatarUrl: string | null
  createdAt: string
  updatedAt?: string
  isMyComment: boolean
  parentCommentId: string | null
  likesCount: number
  isLikedByMe: boolean
}

export type GetComments = {
  request: {
    postId: string
    cursor?: string
    limit?: number
  }
  response: {
    items: Comment[]
    nextCursor: string | null
    hasMore: boolean
  }
  error: ErrorResponse
}

export type CreateComment = {
  request: {
    postId: string
    content: string
    /** Для оптимистичного placeholder-комментария до прихода реального ответа. */
    currentUserId?: string
    currentUserName?: string
  }
  response: Comment
  error: ErrorResponse | AuthoriseError
}

export type CreateReply = {
  request: {
    postId: string
    commentId: string
    content: string
    currentUserId?: string
    currentUserName?: string
  }
  response: Comment
  error: ErrorResponse | AuthoriseError
}

export type LikeComment = {
  request: {
    postId: string
    commentId: string
  }
  response: {
    likesCount: number
    isLikedByMe: boolean
  }
  error: ErrorResponse
}
