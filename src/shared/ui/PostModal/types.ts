import { ReactNode } from 'react'

// 1. Тип для объекта фотографии
export type Photo = {
  id: string
  photoId: string
  s3Key: string
  url: string // URL, который будет использоваться для отображения в галерее
  order: number
  createdAt: string // ISO 8601 строка даты
}

// 2. Тип для автора поста (предполагаемые данные, необходимые для UI)
export type Author = {
  id: string // Взято из authorId в PostDataType, но здесь полные данные
  username: string // "UserName"
  avatarUrl: string // URL аватара
}

// 3. Тип для комментариев (предполагаемые данные, необходимые для UI)
export type CommentType = {
  id: string
  user: Author // Кто оставил комментарий
  text: string
  likesCount?: number
  time: string // Например, "2 hours ago"
  replies?: CommentType[] // <-- вложенные ответы
}

// 4. Основной тип данных поста для компонента PostModal
export type PostDataType = {
  // Данные из API
  id: string
  authorId: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  photos: Photo[]

  author: Author // Полные данные автора
  likesCount: string // Например, '2 243'
  comments: CommentType[] // Список комментариев
}

// 5. Тип для Props компонента PostModal
export type PostModalProps = {
  postData: PostDataType
  open: boolean
  onOpenChange: (open: boolean) => void
}
