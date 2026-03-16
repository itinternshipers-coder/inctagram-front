import { z } from 'zod'

// Схема для фото при создании поста
export const CreatePostPhotoSchema = z.object({
  photoId: z.string().min(1, 'Photo ID is required'),
  s3Key: z.string().min(1, 'S3 key is required'),
  url: z.string().url('Must be a valid URL'),
})

// Схема для создания поста
export const CreatePostSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500, 'Description must not exceed 500 characters'),
  photos: z.array(CreatePostPhotoSchema).min(1, 'At least one photo is required').max(10, 'Maximum 10 photos allowed'),
})

// Схема для редактирования поста
export const UpdatePostSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500, 'Description must not exceed 500 characters'),
})

// TypeScript типы из Zod схем
export type CreatePostFormData = z.infer<typeof CreatePostSchema>
export type UpdatePostFormData = z.infer<typeof UpdatePostSchema>
export type CreatePostPhotoData = z.infer<typeof CreatePostPhotoSchema>
