export type Photo = {
  id: string
  photoId: string
  s3Key: string
  url: string
  order: number
  createdAt: string
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

export type PostDataType = {
  id: string
  authorId: string
  userName: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  likesCount: number
  photos: Photo[]
  comments: CommentType[]
}

export type PostModalProps = {
  postData: PostDataType
  open: boolean
  onOpenChange: (open: boolean) => void
}
