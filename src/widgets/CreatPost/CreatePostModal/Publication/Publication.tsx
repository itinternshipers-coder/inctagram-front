// // my first working component
// 'use client'
//
// import { useCreatePostMutation } from '@/entities/post/api/posts-api'
// import { CreatePostSchema } from '@/entities/post/model'
// import { ImageGallery } from '@/shared/ui/PostModal/ImageGallery/ImageGallery'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { ModalStep } from '@/widgets/CreatPost/CreatePostModal/CreatePostModal'
// import { ModalHeader } from '@/widgets/CreatPost/CreatePostModal/ModalHeader'
// import { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import s from 'src/widgets/CreatPost/CreatePostModal/Publication/Publication.module.scss'
// import { z } from 'zod'
//
// // Нужно вывести тип из схемы
// type CreatePostFormData = z.infer<typeof CreatePostSchema>
//
// export type PhotoType = {
//   photoId: string
//   url: string
//   order: number
//   createdAt: string
// }
//
// type UploadedPhotoType = {
//   photoId: string
//   s3Key: string
//   url: string
//   order: number
// }
//
// type PublicationProps = {
//   images: File[]
//   onBack: () => void
//   onNext?: () => void
//   currentStep: ModalStep
// }
//
// // Модифицированная схема для формы (только описание)
// const CreatePostFormSchema = z.object({
//   description: CreatePostSchema.shape.description,
// })
//
// type CreatePostFormInput = z.infer<typeof CreatePostFormSchema>
//
// export const Publication = ({ images, onBack, onNext, currentStep }: PublicationProps) => {
//   const [photos, setPhotos] = useState<PhotoType[]>([])
//   const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotoType[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadError, setUploadError] = useState<string | null>(null)
//
//   const [createPost, { isLoading: isCreatingPost, error: createPostError }] = useCreatePostMutation()
//
//   // Форма с валидацией (только для описания)
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     reset,
//     watch,
//   } = useForm<CreatePostFormInput>({
//     resolver: zodResolver(CreatePostFormSchema),
//     mode: 'onChange',
//   })
//
//   const description = watch('description')
//
//   // Преобразование File[] в PhotoType[] для предпросмотра
//   useEffect(() => {
//     if (!images || images.length === 0) {
//       setPhotos([])
//       setIsLoading(false)
//       return
//     }
//
//     const convertFilesToPhotos = async () => {
//       setIsLoading(true)
//
//       const convertedPhotos: PhotoType[] = await Promise.all(
//         images.map(async (file, index) => {
//           const url = URL.createObjectURL(file)
//
//           return {
//             photoId: `temp-${Date.now()}-${index}`,
//             url,
//             order: index,
//             createdAt: new Date().toISOString(),
//           }
//         })
//       )
//
//       setPhotos(convertedPhotos)
//       setIsLoading(false)
//     }
//
//     convertFilesToPhotos()
//
//     return () => {
//       photos.forEach((photo) => {
//         if (photo.url.startsWith('blob:')) {
//           URL.revokeObjectURL(photo.url)
//         }
//       })
//     }
//   }, [images])
//
//   // Функция для загрузки фото на сервер (MOCK для тестирования)
//   // const uploadPhotoToServer = async (file: File, index: number): Promise<UploadedPhotoType> => {
//   //   // МОК-реализация для тестирования
//   //   // В реальном приложении здесь будет запрос к вашему API
//   //
//   //   // Имитация задержки загрузки
//   //   await new Promise((resolve) => setTimeout(resolve, 1000))
//   //
//   //   // Генерация моковых данных
//   //   const fileName = file.name.replace(/\.[^/.]+$/, '') // Убираем расширение
//   //   const timestamp = Date.now()
//   //   const mockPhotoId = `photo-${timestamp}-${index}`
//   //   const mockS3Key = `photos/user/${mockPhotoId}/${fileName}.jpg`
//   //   const mockUrl = `https://storage.yandexcloud.net/bucket/${mockS3Key}`
//   //
//   //   return {
//   //     photoId: mockPhotoId,
//   //     s3Key: mockS3Key,
//   //     url: mockUrl,
//   //     order: index,
//   //   }
//   // }
//
//   // const uploadPhotoToServer = async (file: File, index: number): Promise<UploadedPhotoType> => {
//   //   try {
//   //     const formData = new FormData()
//   //     formData.append('photo', file) // Используем 'file' вместо 'photo'
//   //     formData.append('userId', 'dd4b0337-9ffe-48c0-b10b-10fdf0263a23') // Используем переданный userId
//   //
//   //     const response = await fetch('https://gateway.traineegramm.ru/api/v1/photos/upload', {
//   //       method: 'POST',
//   //       body: formData,
//   //       // headers не нужны для FormData, браузер установит их автоматически
//   //     })
//   //
//   //     if (!response.ok) {
//   //       const errorText = await response.text()
//   //       console.error('Upload failed:', errorText)
//   //       throw new Error(`Upload failed: ${response.status} ${errorText}`)
//   //     }
//   //
//   //     const data = await response.json()
//   //
//   //     // Проверяем структуру ответа
//   //     if (!data.photoId || !data.s3Key || !data.url) {
//   //       console.error('Invalid response structure:', data)
//   //       throw new Error('Invalid response from server')
//   //     }
//   //
//   //     console.log(`Photo ${index + 1} uploaded:`, data)
//   //
//   //     return {
//   //       photoId: data.photoId,
//   //       s3Key: data.s3Key,
//   //       url: data.url,
//   //       order: index,
//   //     }
//   //   } catch (error) {
//   //     console.error(`Error uploading photo ${index + 1}:`, error)
//   //     throw error
//   //   }
//   // }
//
//   // Функция для загрузки фото на сервер
//   const uploadPhotoToServer = async (file: File, index: number): Promise<UploadedPhotoType> => {
//     try {
//       const formData = new FormData()
//       formData.append('photo', file)
//       formData.append('userId', 'dd4b0337-9ffe-48c0-b10b-10fdf0263a23')
//
//       const response = await fetch('https://gateway.traineegramm.ru/api/v1/photos/upload', {
//         method: 'POST',
//         body: formData,
//       })
//
//       if (!response.ok) {
//         const errorText = await response.text()
//         throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//       }
//
//       const data = await response.json()
//       console.log('Upload response:', data)
//
//       if (!data.success || !data.photo) {
//         throw new Error('Invalid response structure from server')
//       }
//
//       const { photo } = data
//
//       // Извлекаем s3Key из URL
//       const extractS3KeyFromUrl = (url: string): string => {
//         try {
//           const urlObj = new URL(url)
//           // Удаляем первый слеш: /traineegramm/... → traineegramm/...
//           const path = urlObj.pathname
//           return path.startsWith('/') ? path.substring(1) : path
//         } catch {
//           // Если не удалось распарсить URL, создаем ключ на основе photoId
//           return `traineegramm/photos/${photo.id}/${Date.now()}.jpg`
//         }
//       }
//
//       return {
//         photoId: photo.id,
//         s3Key: extractS3KeyFromUrl(photo.url),
//         url: photo.url,
//         order: index,
//       }
//     } catch (error) {
//       console.error(`Error uploading photo ${index + 1}:`, error)
//       throw error
//     }
//   }
//
//   // Загрузка всех фото на сервер
//   const uploadAllPhotos = async (): Promise<UploadedPhotoType[]> => {
//     if (images.length === 0) {
//       return []
//     }
//
//     setIsUploading(true)
//     setUploadError(null)
//
//     try {
//       console.log(`Starting upload of ${images.length} photos...`)
//
//       const uploadPromises = images.map((file, index) => uploadPhotoToServer(file, index))
//
//       const uploaded = await Promise.all(uploadPromises)
//
//       console.log('Photos uploaded successfully:', uploaded)
//       setUploadedPhotos(uploaded)
//       return uploaded
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to upload photos'
//       setUploadError(errorMessage)
//       console.error('Error uploading photos:', error)
//       throw error
//     } finally {
//       setIsUploading(false)
//     }
//   }
//
//   // Функция создания поста
//   const handleCreatePost = async (formData: CreatePostFormInput) => {
//     console.log('Starting post creation with data:', formData)
//
//     let photosToUse = uploadedPhotos
//
//     try {
//       // Если фото еще не загружены - загружаем их
//       if (photosToUse.length === 0) {
//         console.log('No photos uploaded yet, uploading now...')
//         photosToUse = await uploadAllPhotos()
//
//         if (photosToUse.length === 0) {
//           setUploadError('No photos were uploaded')
//           return
//         }
//       }
//
//       console.log('Creating post with photos:', photosToUse)
//
//       // Создаем полный объект поста
//       const postData: CreatePostFormData = {
//         description: formData.description.trim(),
//         photos: photosToUse.map((photo) => ({
//           photoId: photo.photoId,
//           s3Key: photo.s3Key,
//           url: photo.url,
//         })),
//       }
//
//       console.log('Sending post data:', postData)
//
//       // Проверяем, что данные соответствуют схеме
//       try {
//         CreatePostSchema.parse(postData)
//         console.log('Post data validated successfully')
//       } catch (validationError) {
//         console.error('Schema validation error:', validationError)
//         setUploadError('Invalid post data')
//         return
//       }
//
//       // Отправляем запрос на создание поста
//       const result = await createPost(postData).unwrap()
//
//       console.log('Post created successfully:', result)
//
//       // Очистка временных URL
//       photos.forEach((photo) => {
//         if (photo.url.startsWith('blob:')) {
//           URL.revokeObjectURL(photo.url)
//         }
//       })
//
//       // Очистка формы
//       reset()
//       setUploadedPhotos([])
//
//       // Переход дальше
//       if (onNext) {
//         onNext()
//       }
//     } catch (error: any) {
//       console.error('Failed to create post:', error)
//
//       // Обработка ошибок RTK Query
//       if (error?.data?.message) {
//         setUploadError(error.data.message)
//       } else if (error?.error) {
//         setUploadError(error.error)
//       } else {
//         setUploadError('Failed to create post. Please try again.')
//       }
//     }
//   }
//
//   const author = {
//     id: '11212',
//     username: 'NoName',
//     avatarUrl: 'https://cs13.pikabu.ru/avatars/7246/x7246765-497572027.png',
//   }
//
//   const isSubmitting = isUploading || isCreatingPost
//   const canPublish = isValid && images.length > 0 && !isSubmitting
//
//   if (isLoading) {
//     return (
//       <div className={s.loadingContainer}>
//         <p>Loading images...</p>
//       </div>
//     )
//   }
//
//   if (images.length === 0) {
//     return (
//       <div className={s.noImages}>
//         <p>No images to publish</p>
//         <button onClick={onBack} className={s.backButton}>
//           Back
//         </button>
//       </div>
//     )
//   }
//
//   return (
//     <>
//       <ModalHeader
//         currentStep={currentStep}
//         onBack={onBack}
//         onNext={handleSubmit(handleCreatePost)}
//         disabled={!canPublish}
//         // nextText={isSubmitting ? 'Publishing...' : 'Publish'}
//       />
//
//       <div className={s.contentPublication}>
//         {/* Отображение ошибок */}
//         {uploadError && (
//           <div className={s.errorMessage}>
//             <p>Error: {uploadError}</p>
//           </div>
//         )}
//
//         {createPostError && (
//           <div className={s.errorMessage}>
//             <p>
//               Create post error: {'data' in createPostError ? JSON.stringify(createPostError.data) : 'Unknown error'}
//             </p>
//           </div>
//         )}
//
//         <div className={s.previewSection}>
//           <div className={s.previewContainer}>
//             <ImageGallery photos={photos} />
//           </div>
//         </div>
//
//         {/* Статус загрузки */}
//         {/*{isUploading && (*/}
//         {/*  <div className={s.uploadStatus}>*/}
//         {/*    <p>*/}
//         {/*      Uploading {images.length} photos... ({uploadedPhotos.length + 1}/{images.length})*/}
//         {/*    </p>*/}
//         {/*    <div className={s.progressBar}></div>*/}
//         {/*  </div>*/}
//         {/*)}*/}
//
//         <div className={s.publicationInfo}>
//           <div className={s.authorInfo}>
//             {author.avatarUrl && <img src={author.avatarUrl} alt={author.username} className={s.authorAvatar} />}
//             <strong>{author.username}</strong>
//           </div>
//
//           <div className={s.stats}>
//             <p>
//               <strong>Images to publish:</strong> {images.length}
//             </p>
//             <p>
//               <strong>Description length:</strong> {description?.length || 0}/500
//             </p>
//           </div>
//
//           <form onSubmit={handleSubmit(handleCreatePost)} className={s.publicationForm}>
//             <div className={s.descriptionSection}>
//               <textarea
//                 id="description"
//                 {...register('description')}
//                 className={`${s.descriptionInput} ${errors.description ? s.error : ''}`}
//                 placeholder="Add a description..."
//                 rows={4}
//                 cols={40}
//                 disabled={isSubmitting}
//               />
//               {errors.description && <span className={s.errorText}>{errors.description.message}</span>}
//             </div>
//
//             {/*<div className={s.debugInfo}>*/}
//             {/*  <details>*/}
//             {/*    <summary>Debug Info</summary>*/}
//             {/*    <pre style={{ fontSize: '12px', overflow: 'auto' }}>*/}
//             {/*      isValid: {isValid.toString()}*/}
//             {/*      <br />*/}
//             {/*      isUploading: {isUploading.toString()}*/}
//             {/*      <br />*/}
//             {/*      isCreatingPost: {isCreatingPost.toString()}*/}
//             {/*      <br />*/}
//             {/*      canPublish: {canPublish.toString()}*/}
//             {/*      <br />*/}
//             {/*      Images count: {images.length}*/}
//             {/*      <br />*/}
//             {/*      Uploaded photos: {uploadedPhotos.length}*/}
//             {/*      <br />*/}
//             {/*      Description length: {description?.length || 0}*/}
//             {/*    </pre>*/}
//             {/*  </details>*/}
//             {/*</div>*/}
//           </form>
//         </div>
//       </div>
//     </>
//   )
// }

// my working second component
'use client'

import { useCreatePostMutation } from '@/entities/post/api/posts-api'
import { CreatePostSchema } from '@/entities/post/model'
import { ImageGallery } from '@/shared/ui/PostModal/ImageGallery/ImageGallery'
import { Typography } from '@/shared/ui/Typography/Typography'
import { ModalStep } from '@/widgets/CreatPost/CreatePostModal/CreatePostModal'
import { ModalHeader } from '@/widgets/CreatPost/CreatePostModal/ModalHeader'
import { zodResolver } from '@hookform/resolvers/zod'
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

type UploadedPhotoType = {
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
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const [createPost, { isLoading: isCreatingPost, error: createPostError }] = useCreatePostMutation()

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
      setIsLoading(false)
      return
    }

    const convertFilesToPhotos = async () => {
      setIsLoading(true)
      isSubmitting
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
      setIsLoading(false)
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

  // Функция для загрузки фото на сервер
  const uploadPhotoToServer = async (file: File, index: number): Promise<UploadedPhotoType> => {
    try {
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('userId', 'dd4b0337-9ffe-48c0-b10b-10fdf0263a23')

      const response = await fetch('https://gateway.traineegramm.ru/api/v1/photos/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Upload response:', data)

      if (!data.success || !data.photo) {
        throw new Error('Invalid response structure from server')
      }

      const { photo } = data

      // Извлекаем s3Key из URL
      // const extractS3KeyFromUrl = (url: string): string => {
      //   try {
      //     const urlObj = new URL(url)
      //     // Удаляем первый слеш: /traineegramm/... → traineegramm/...
      //     const path = urlObj.pathname
      //     return path.startsWith('/') ? path.substring(1) : path
      //   } catch {
      //     // Если не удалось распарсить URL, создаем ключ на основе photoId
      //     return `traineegramm/photos/${photo.id}/${Date.now()}.jpg`
      //   }
      // }

      return {
        photoId: photo.id,
        s3Key: photo.s3Key,
        url: photo.url,
      }
    } catch (error) {
      console.error(`Error uploading photo ${index + 1}:`, error)
      throw error
    }
  }

  // Загрузка всех фото на сервер
  const uploadAllPhotos = async (): Promise<UploadedPhotoType[]> => {
    if (images.length === 0) {
      return []
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      console.log(`Starting upload of ${images.length} photos...`)

      const uploadPromises = images.map((file, index) => uploadPhotoToServer(file, index))

      const uploaded = await Promise.all(uploadPromises)

      console.log('Photos uploaded successfully:', uploaded)
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
    console.log('Starting post creation with data:', formData)

    let photosToUse = uploadedPhotos

    try {
      // Если фото еще не загружены - загружаем их
      if (photosToUse.length === 0) {
        console.log('No photos uploaded yet, uploading now...')
        photosToUse = await uploadAllPhotos()

        if (photosToUse.length === 0) {
          setUploadError('No photos were uploaded')
          return
        }
      }

      console.log('Creating post with photos:', photosToUse)

      // Создаем полный объект поста
      const postData: CreatePostFormData = {
        description: formData.description.trim(),
        photos: photosToUse.map((photo) => ({
          photoId: photo.photoId,
          s3Key: photo.s3Key,
          url: photo.url,
        })),
      }

      console.log('Sending post data:', postData)

      // Проверяем, что данные соответствуют схеме
      try {
        CreatePostSchema.parse(postData)
        console.log('Post data validated successfully')
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
    } catch (error: any) {
      console.error('Failed to create post:', error)

      // Обработка ошибок RTK Query
      if (error?.data?.message) {
        setUploadError(error.data.message)
      } else if (error?.error) {
        setUploadError(error.error)
      } else {
        setUploadError('Failed to create post. Please try again.')
      }
    }
  }

  const author = {
    id: '11212',
    username: 'NoName',
    avatarUrl: 'https://cs13.pikabu.ru/avatars/7246/x7246765-497572027.png',
  }

  const isSubmitting = isUploading || isCreatingPost
  const canPublish = isValid && images.length > 0 && !isSubmitting

  if (isLoading) {
    return (
      <div className={s.loadingContainer}>
        <p>Loading images...</p>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className={s.noImages}>
        <p>No images to publish</p>
        <button onClick={onBack} className={s.backButton}>
          Back
        </button>
      </div>
    )
  }
  const handlePublish = () => {
    submitButtonRef.current?.click()
  }

  return (
    <>
      <ModalHeader currentStep={currentStep} onBack={onBack} onNext={handlePublish} disabled={!canPublish} />

      <div className={s.contentPublication}>
        {/* Отображение ошибок */}
        {/*{uploadError && (*/}
        {/*  <div className={s.errorMessage}>*/}
        {/*    <p>Error: {uploadError}</p>*/}
        {/*  </div>*/}
        {/*)}*/}
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

          <form onSubmit={handleSubmit(handleCreatePost)} className={s.publicationForm}>
            <div className={s.descriptionSection}>
              <Typography variant={'regular_text_14'} className={s.titleDescription}>
                Add publication descriptions
              </Typography>
              <textarea
                id="description"
                {...register('description')}
                className={`${s.textArea} ${errors.description?.message}`}
                placeholder="Add a description..."
                rows={4}
                disabled={isSubmitting}
              />
              <div className={s.countSymbol}>{description?.length || 0}/500</div>
            </div>
            {/* Скрытая кнопка submit */}
            <button type="submit" ref={submitButtonRef} style={{ display: 'none' }} />
          </form>
        </div>
      </div>
    </>
  )
}
