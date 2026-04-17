'use client'

import { useCreatePostMutation } from '@/entities/post/api/posts-api'
import { CreatePostSchema } from '@/entities/post/model'
import { ModalSteps } from '@/features/create-post/model/types/modalSteps'
import { clearUrlForUnmount } from './utils/clearUrlForUnmount'
import { ModalHeader } from '../ModalHeader/ModalHeader'
import { uploadAllPhotos } from './lib/uploadAllPhotos'
import { usePhotoPreview } from './lib/usePhotoPreview'
import s from './Publication.module.scss'
import { UploadedPhotoType } from './lib/types'
import { handleApiError } from './utils/handleApiError'
import { useAuthContext } from '@/features/auth/lib/use-auth-context'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import { revalidateHomePage } from '@/app/actions'
import { ROUTES } from '@/shared/config/routes'
import { Alert } from '@/shared/ui/Alert/Alert'
import Loader from '@/shared/ui/Loader/Loader'
import { Modal } from '@/shared/ui/Modal/Modal'
import { ImageGallery } from '@/shared/ui/PostModal/ImageGallery/ImageGallery'
import TextArea from '@/shared/ui/TextArea/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
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
  const { photos, photosRef } = usePhotoPreview(images)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotoType[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation()
  const { user } = useAuthContext()
  const { data: profile } = useGetProfileQuery(user?.userId ?? '')

  const router = useRouter()

  // Форма с валидацией (только для описания)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<CreatePostFormInput>({
    resolver: zodResolver(CreatePostFormSchema),
    mode: 'onChange',
  })

  const description = useWatch({ control, name: 'description' })

  // Функция создания поста
  const handleCreatePost = async (formData: CreatePostFormInput) => {
    let photosToUse = uploadedPhotos

    try {
      // Если фото еще не загружены - загружаем их
      if (photosToUse.length === 0) {
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

      // Отправляем запрос на создание поста
      const result = await createPost(postData).unwrap()

      // Логирование только в development
      if (process.env.NODE_ENV === 'development') {
        console.log('Post created successfully:', result)
      }

      // Очистка временных URL
      clearUrlForUnmount(photosRef)
      photosRef.current = []

      // Очистка формы
      reset()
      setUploadedPhotos([])

      // Инвалидировать ISR-кеш и Router Cache для главной страницы
      await revalidateHomePage()

      // Переход дальше
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

  const handleDiscard = () => {
    setShowModal(false)
  }

  const handleSavePost = () => {
    setShowModal(false)
    if (onNext) {
      onNext()
    }
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
              {profile?.avatar?.[0]?.url && (
                <Image
                  src={profile.avatar[0].url}
                  alt={profile.username}
                  className={s.authorAvatar}
                  width={36}
                  height={36}
                />
              )}
              <strong>{profile?.username ?? 'NoName'}</strong>
            </div>

            <form onSubmit={(e) => handleSubmit(handleCreatePost)(e)}>
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
              onCancel={handleDiscard}
            />
            {isSubmitting && <Loader>Publication in progress</Loader>}
          </div>
        </div>
        {uploadError && <Alert status="error" text={uploadError} position="bottom-left" />}
      </div>
    </div>
  )
}
