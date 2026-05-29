import type { ErrorResponse, AuthoriseError } from '@/shared/api/types'

// Фотография поста
export type PostPhoto = {
  id: string
  photoId: string
  s3Key: string
  url: string
  order: number
  createdAt: string
}

// Краткая информация о лайкнувшем пользователе (recentLikers)
export type RecentLiker = {
  userId: string
  userName: string
  avatarUrl: string | null
}

// Пост.
// Поля, помеченные optional (после photos), приходят в эндпоинтах, отдающих PostViewDto
// (getFeed, getPostById), и могут отсутствовать в более ранних `getPosts`/`getUserPosts`.
export type Post = {
  id: string
  authorId: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  photos: PostPhoto[]
  userName?: string
  authorAvatarUrl?: string | null
  likesCount?: number
  isLikedByMe?: boolean
  recentLikers?: RecentLiker[]
  commentsCount?: number
}

// Получение списка постов
export type GetPosts = {
  request: {
    authorId?: string
  }
  response: { items: Post[]; pageSize: number; totalCount: number }
  error: ErrorResponse
}

// Получение поста по ID
export type GetPostById = {
  request: {
    id: string
  }
  response: Post & { author?: { id: string; username: string } }
  error: ErrorResponse
}

// Создание поста
export type CreatePost = {
  request: {
    description: string
    photos: Array<{
      photoId: string
      s3Key: string
      url: string
    }>
  }
  response: Post
  error: ErrorResponse | AuthoriseError
}

// Обновление поста
export type UpdatePost = {
  request: {
    id: string
    body: {
      description: string
    }
  }
  response: void // 204 No Content
  error: ErrorResponse | AuthoriseError
}

// Удаление поста
export type DeletePost = {
  request: {
    id: string
  }
  response: void // 204 No Content
  error: ErrorResponse | AuthoriseError
}

// Лента подписок (PostViewDto[]) с cursor-пагинацией
export type GetFeed = {
  request: {
    cursor?: string
    pageSize?: number
  }
  response: {
    items: Post[]
    nextCursor: string | null
    hasMore: boolean
  }
  error: ErrorResponse
}

// Лайк / снятие лайка с поста — PUT/DELETE /posts/{postId}/like
export type LikePost = {
  request: {
    postId: string
  }
  response: {
    likesCount: number
    isLikedByMe: boolean
    recentLikers: RecentLiker[]
  }
  error: ErrorResponse
}

// Получение постов пользователя
export type GetUserPosts = {
  request: {
    userId: string
    cursor?: string
    pageSize?: string
    sortDirection?: 'asc' | 'desc'
  }
  response: {
    totalCount: number
    pageSize: number
    items: Post[]
  }
  error: ErrorResponse
}
