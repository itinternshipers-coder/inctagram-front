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

// Пост
export type Post = {
  id: string
  authorId: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  photos: PostPhoto[]
}

// Получение списка постов
export type GetPosts = {
  request: {
    authorId?: string
  }
  response: Post[]
  error: ErrorResponse
}

// Получение поста по ID
export type GetPostById = {
  request: {
    id: string
  }
  response: Post
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
