'use client'

import { useCreatePostMutation } from '@/entities/post/api/posts-api'
import { CreatePostSchema } from '@/entities/post/model'
import { ModalSteps } from '@/features/create-post/model/types/modalSteps'
import { ModalHeader } from '@/features/create-post/ui/CreatePostModal/ModalHeader/ModalHeader'
import { uploadAllPhotos } from '@/features/create-post/ui/CreatePostModal/Publication/lib/uploadAllPhotos'
import s from './Publication.module.scss'
import { PhotoType, UploadedPhotoType } from './types'
import { handleApiError } from './utils/handleApiError'
import { ROUTES } from '@/shared/config/routes'
import { Alert } from '@/shared/ui/Alert/Alert'
import Loader from '@/shared/ui/Loader/Loader'
import { Modal } from '@/shared/ui/Modal/Modal'
import { ImageGallery } from '@/shared/ui/PostModal/ImageGallery/ImageGallery'
import TextArea from '@/shared/ui/TextArea/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type PublicationProps = {
  images: File[]
  onBack: () => void
  onNext?: () => void
  currentStep: ModalSteps
}

type CreatePostFormData = z.infer<typeof CreatePostSchema>

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
  const photosRef = useRef<PhotoType[]>([])

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
      // Очищаем предыдущие URL перед очисткой состояния
      photosRef.current.forEach((photo) => {
        try {
          if (photo.url.startsWith('blob:')) {
            URL.revokeObjectURL(photo.url)
          }
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      })
      photosRef.current = []
      setPhotos([])
      return
    }

    const convertFilesToPhotos = async () => {
      // Очищаем предыдущие URL перед созданием новых
      photosRef.current.forEach((photo) => {
        try {
          if (photo.url.startsWith('blob:')) {
            URL.revokeObjectURL(photo.url)
          }
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      })

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

      photosRef.current = convertedPhotos
      setPhotos(convertedPhotos)
    }

    convertFilesToPhotos()

    return () => {
      // Очистка URL при размонтировании или изменении images
      photosRef.current.forEach((photo) => {
        try {
          if (photo.url.startsWith('blob:')) {
            URL.revokeObjectURL(photo.url)
          }
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      })
      photosRef.current = []
    }
  }, [images])

  // Функция создания поста
  const handleCreatePost = async (formData: CreatePostFormInput) => {
    let photosToUse = uploadedPhotos

    try {
      // Если фото еще не загружены - загружаем их
      if (photosToUse.length === 0) {
        // console.log('No photos uploaded yet, uploading now...')
        photosToUse = await uploadAllPhotos(images, setIsUploading, setUploadError, setUploadedPhotos)

        if (photosToUse.length === 0) {
          setUploadError('No photos were uploaded')
          return
        }
      }

      // Создаем полный объект поста
      const postData: CreatePostFormData = {
        description: formData.description.trim(),
        photos: photosToUse.map((photo) => ({
          photoId: photo.photoId,
          s3Key: photo.s3Key,
          url: photo.url,
        })),
      }

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

      // Логирование только в development
      if (process.env.NODE_ENV === 'development') {
        console.log('Post created successfully:', result)
      }

      // Очистка временных URL
      photosRef.current.forEach((photo) => {
        try {
          if (photo.url.startsWith('blob:')) {
            URL.revokeObjectURL(photo.url)
          }
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      })
      photosRef.current = []

      // Очистка формы
      reset()
      setUploadedPhotos([])

      // // Переход дальше
      if (onNext) {
        onNext()
      }
    } catch (err) {
      handleApiError(err, setUploadError)
    }
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
              {/*{author.avatarUrl && <img src={author.avatarUrl} alt={author.username} className={s.authorAvatar} />}*/}
              <img
                src={'https://cs13.pikabu.ru/avatars/7246/x7246765-497572027.png'}
                alt={'NoName'}
                className={s.authorAvatar}
              />
              <strong>{'NoName'}</strong>
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
