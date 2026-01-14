'use client'

import { useCreatePostMutation } from '@/entities/post/api/posts-api'
import { CreatePostSchema } from '@/entities/post/model'
import { ROUTES } from '@/shared/config/routes'
import { Alert } from '@/shared/ui/Alert/Alert'
import Loader from '@/shared/ui/Loader/Loader'
import { Modal } from '@/shared/ui/Modal/Modal'
import { ImageGallery } from '@/shared/ui/PostModal/ImageGallery/ImageGallery'
import TextArea from '@/shared/ui/TextArea/TextArea'
import { ModalStep } from '@/widgets/CreatPost/CreatePostModal/CreatePostModal'
import { uploadPhotoToServer } from '@/widgets/CreatPost/CreatePostModal/hooks/uploadPhotoToServer'
import { ModalHeader } from '@/widgets/CreatPost/CreatePostModal/ModalHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import s from 'src/widgets/CreatPost/CreatePostModal/Publication/Publication.module.scss'
import { z } from 'zod'

// Нужно вывести тип из схемы
type CreatePostFormData = z.infer<typeof CreatePostSchema>

export type PhotoType = {
  photoId: string
  url: string
  order: number
  createdAt: string
}

export type UploadedPhotoType = {
  photoId: string
  s3Key: string
  url: string
}

type PublicationProps = {
  images: File[]
  onBack: () => void
  onNext?: () => void
  currentStep: ModalStep
}

// Модифицированная схема для формы (только описание)
const CreatePostFormSchema = z.object({
  description: CreatePostSchema.shape.description,
})

type CreatePostFormInput = z.infer<typeof CreatePostFormSchema>

export const Publication = ({ images, onBack, onNext, currentStep }: PublicationProps) => {
  const [photos, setPhotos] = useState<PhotoType[]>([])
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotoType[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation()

  const router = useRouter()

  // Форма с валидацией (только для описания)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<CreatePostFormInput>({
    resolver: zodResolver(CreatePostFormSchema),
    mode: 'onChange',
  })

  const description = watch('description')

  // Преобразование File[] в PhotoType[] для предпросмотра
  useEffect(() => {
    if (!images || images.length === 0) {
      setPhotos([])
      return
    }

    const convertFilesToPhotos = async () => {
      const convertedPhotos: PhotoType[] = await Promise.all(
        images.map(async (file, index) => {
          const url = URL.createObjectURL(file)

          return {
            photoId: `temp-${Date.now()}-${index}`,
            url,
            order: index,
            createdAt: new Date().toISOString(),
          }
        })
      )

      setPhotos(convertedPhotos)
    }

    convertFilesToPhotos()

    return () => {
      photos.forEach((photo) => {
        if (photo.url.startsWith('blob:')) {
          URL.revokeObjectURL(photo.url)
        }
      })
    }
  }, [images])

  // Загрузка всех фото на сервер
  const uploadAllPhotos = async (): Promise<UploadedPhotoType[]> => {
    if (images.length === 0) {
      return []
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // console.log(`Starting upload of ${images.length} photos...`)

      const uploadPromises = images.map((file, index) => uploadPhotoToServer(file, index))

      const uploaded = await Promise.all(uploadPromises)

      // console.log('Photos uploaded successfully:', uploaded)
      setUploadedPhotos(uploaded)
      return uploaded
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photos'
      setUploadError(errorMessage)
      console.error('Error uploading photos:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Функция создания поста
  const handleCreatePost = async (formData: CreatePostFormInput) => {
    // console.log('Starting post creation with data:', formData)

    let photosToUse = uploadedPhotos

    try {
      // Если фото еще не загружены - загружаем их
      if (photosToUse.length === 0) {
        // console.log('No photos uploaded yet, uploading now...')
        photosToUse = await uploadAllPhotos()

        if (photosToUse.length === 0) {
          setUploadError('No photos were uploaded')
          return
        }
      }

      // console.log('Creating post with photos:', photosToUse)

      // Создаем полный объект поста
      const postData: CreatePostFormData = {
        description: formData.description.trim(),
        photos: photosToUse.map((photo) => ({
          photoId: photo.photoId,
          s3Key: photo.s3Key,
          url: photo.url,
        })),
      }

      // console.log('Sending post data:', postData)

      // Проверяем, что данные соответствуют схеме
      try {
        CreatePostSchema.parse(postData)
        // console.log('Post data validated successfully')
      } catch (validationError) {
        console.error('Schema validation error:', validationError)
        setUploadError('Invalid post data')
        return
      }

      // Отправляем запрос на создание поста
      const result = await createPost(postData).unwrap()

      console.log('Post created successfully:', result)

      // Очистка временных URL
      photos.forEach((photo) => {
        if (photo.url.startsWith('blob:')) {
          URL.revokeObjectURL(photo.url)
        }
      })

      // Очистка формы
      reset()
      setUploadedPhotos([])

      // // Переход дальше
      if (onNext) {
        onNext()
      }
    } catch (err) {
      const error = err as FetchBaseQueryError | SerializedError
      let errorMessage = 'Неизвестная ошибка'

      if ('status' in error) {
        // Типизируем data как unknown и проверяем
        const data = error.data as unknown

        if (typeof data === 'object' && data !== null) {
          const errorData = data as Record<string, unknown>

          // Безопасно извлекаем строковые значения
          errorMessage =
            (typeof errorData.message === 'string' ? errorData.message : '') ||
            (typeof errorData.error === 'string' ? errorData.error : '') ||
            (typeof errorData.detail === 'string' ? errorData.detail : '') ||
            `Ошибка ${error.status}`
        } else if (typeof data === 'string') {
          // Если data это просто строка
          errorMessage = data
        } else {
          errorMessage = `Ошибка ${error.status}`
        }
      } else if (error?.message) {
        errorMessage = error.message
      }

      setUploadError(errorMessage)
    }
  }

  // Временная заглушка для author
  const author = {
    id: 'id',
    username: 'NoName',
    avatarUrl: 'https://cs13.pikabu.ru/avatars/7246/x7246765-497572027.png',
  }

  const isSubmitting = isUploading || isCreatingPost
  const canPublish = isValid && images.length > 0 && !isSubmitting

  const handlePublish = () => {
    submitButtonRef.current?.click()
  }

  const handleSavePost = () => {
    router.push(ROUTES.PUBLIC.HOME)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(true)
    }
  }

  return (
    <div className={s.overlayModal} onClick={handleOverlayClick}>
      <div className={s.containerModalRectangularPublication} onClick={(e) => e.stopPropagation()}>
        <ModalHeader
          currentStep={currentStep}
          onBack={onBack}
          onNext={handlePublish}
          disabled={!canPublish}
          onSubmitting={isSubmitting}
        />
        <div className={s.contentPublication}>
          <div className={s.previewSection}>
            <div className={s.previewContainer}>
              <ImageGallery photos={photos} />
            </div>
          </div>

          <div className={s.publicationInfo}>
            <div className={s.authorInfo}>
              {author.avatarUrl && <img src={author.avatarUrl} alt={author.username} className={s.authorAvatar} />}
              <strong>{author.username}</strong>
            </div>

            <form onSubmit={handleSubmit(handleCreatePost)}>
              <TextArea
                label="Add publication descriptions"
                id="description"
                {...register('description')}
                placeholder="Add a description..."
                rows={4}
                disabled={isSubmitting}
                error={!!errors.description}
                errorMessage={errors.description?.message}
              />
              <div className={s.countSymbol}>{description?.length || 0}/500</div>
              {/* Скрытая кнопка submit для отправки формы */}
              <button type="submit" ref={submitButtonRef} style={{ display: 'none' }} />
            </form>
            <Modal
              open={showModal}
              onOpenChange={setShowModal}
              title="Close"
              message="Do you really want to close the creation of a publication?
              If you close everything will be deleted"
              confirmMode={true}
              buttonText="Save draft"
              cancelButtonText="Discard"
              isCancelPrimary={false}
              onAction={handleSavePost}
            />
            {isSubmitting && <Loader>Publication in progress</Loader>}
          </div>
        </div>
        {uploadError && <Alert status="error" text={uploadError} position="bottom-left" />}
      </div>
    </div>
  )
}
