export type PhotoType = {
  photoId: string
  url: string
  order: number
  createdAt: string
}

export type UserPostType = {
  id: string
  authorId: string
  author?: {
    id: string
    username: string
  }
  description?: string
  createdAt: string
  updatedAt: string
  photos?: PhotoType[]
}

export type Author = {
  id: string
  username: string
  avatarUrl: string
}

export type CommentType = {
  id: string
  user: Author
  text: string
  likesCount?: number
  time: string
  replies?: CommentType[]
}

export type PostModalProps = {
  postData: UserPostType
  open: boolean
  onOpenChange: (open: boolean) => void
  comments: CommentType[]
}
