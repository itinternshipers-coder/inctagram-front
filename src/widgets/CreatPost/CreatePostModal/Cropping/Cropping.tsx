'use client'

import { useImageUpload } from '@/features/uploadImage/useImageUpload'
import { PlusCircleIcon } from '@/shared/icons/svgComponents'
import getCroppedImg from '@/shared/lib/utils/image/canvasUtils'
import { Typography } from '@/shared/ui/Typography/Typography'
import { ModalStep } from '@/widgets/CreatPost/CreatePostModal/CreatePostModal'
import { ModalHeader } from '@/widgets/CreatPost/CreatePostModal/ModalHeader'
import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import s from 'src/widgets/CreatPost/CreatePostModal/Cropping/Cropping.module.scss'

type AspectRatio = {
  value: number | undefined
  label: string
}

type PhotoType = {
  photoId: string
  file: File
  originalUrl: string
  croppedUrl?: string
  isEdited?: boolean
  croppedAreaPixels?: Area
}

type CroppingProps = {
  images: File[] // Массив изображений
  onCropComplete?: (croppedImages: File[]) => void
  onNext?: () => void
  onBack?: () => void
  currentStep: ModalStep
  onSelectFiles?: (files: File[]) => void
}

const ASPECT_RATIOS: AspectRatio[] = [
  { value: undefined, label: 'Original' },
  { value: 1, label: '1:1' },
  { value: 4 / 5, label: '4:5' },
  { value: 16 / 9, label: '16:9' },
]

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.1
const MAX_IMAGES = 10

export const Cropping = ({
  images,
  onCropComplete = () => {},
  onNext = () => {},
  onBack = () => {},
  currentStep,
  onSelectFiles,
}: CroppingProps) => {
  const [photos, setPhotos] = useState<PhotoType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>(ASPECT_RATIOS[0])
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  const cropDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { file, error, onSelectFile } = useImageUpload({
    maxSizeMB: 10, // Ограничение 10MB
    allowedTypes: ['image/png', 'image/jpeg'],
  })

  // Инициализация фотографий из пропса images
  useEffect(() => {
    const initializePhotos = async () => {
      const newPhotos: PhotoType[] = await Promise.all(
        images.map(async (file, index) => {
          const url = URL.createObjectURL(file)
          return {
            photoId: `${Date.now()}-${index}`,
            file,
            originalUrl: url,
            isEdited: false,
          }
        })
      )

      setPhotos(newPhotos)
      if (newPhotos.length > 0) {
        setCurrentIndex(0)
      }
    }

    initializePhotos()

    return () => {
      // Очистка URL при размонтировании
      photos.forEach((photo) => {
        URL.revokeObjectURL(photo.originalUrl)
        if (photo.croppedUrl) {
          URL.revokeObjectURL(photo.croppedUrl)
        }
      })
    }
  }, [])

  // Обновление preview с дебаунсом
  const updateCroppedPreview = useCallback(async () => {
    const currentPhoto = photos[currentIndex]
    if (!currentPhoto?.croppedAreaPixels || !currentPhoto.originalUrl) return

    setIsGeneratingPreview(true)
    // setError(null)

    try {
      const croppedImageBlob = await getCroppedImg(currentPhoto.originalUrl, currentPhoto.croppedAreaPixels)
      const previewUrl = URL.createObjectURL(croppedImageBlob)

      setCroppedPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return previewUrl
      })

      // Обновляем фото с croppedUrl
      setPhotos((prev) =>
        prev.map((photo, index) => (index === currentIndex ? { ...photo, croppedUrl: previewUrl } : photo))
      )
    } catch (e) {
      console.error('Error updating preview:', e)
    } finally {
      setIsGeneratingPreview(false)
    }
  }, [photos, currentIndex])

  useEffect(() => {
    if (cropDebounceRef.current) {
      clearTimeout(cropDebounceRef.current)
    }

    cropDebounceRef.current = setTimeout(() => {
      if (photos[currentIndex]?.croppedAreaPixels) {
        updateCroppedPreview()
      }
    }, 300)

    return () => {
      if (cropDebounceRef.current) {
        clearTimeout(cropDebounceRef.current)
      }
    }
  }, [photos, currentIndex, updateCroppedPreview])

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setPhotos((prev) =>
        prev.map((photo, index) =>
          index === currentIndex
            ? {
                ...photo,
                croppedAreaPixels,
                isEdited: true,
              }
            : photo
        )
      )
    },
    [currentIndex]
  )

  const handleZoomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value))
  }, [])

  const handleAspectChange = useCallback(
    (ratio: AspectRatio) => {
      setSelectedAspect(ratio)
      setCrop({ x: 0, y: 0 })

      // Сбрасываем croppedAreaPixels для текущего фото
      setPhotos((prev) =>
        prev.map((photo, index) => (index === currentIndex ? { ...photo, croppedAreaPixels: undefined } : photo))
      )
    },
    [currentIndex]
  )

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM))
  }, [])

  const handleSelectPhoto = useCallback((index: number) => {
    setCurrentIndex(index)
    // Сбрасываем состояние кропа для нового изображения
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }, [])

  const handleDeletePhoto = useCallback(
    (index: number) => {
      // Очищаем URL перед удалением
      const photoToDelete = photos[index]
      URL.revokeObjectURL(photoToDelete.originalUrl)
      if (photoToDelete.croppedUrl) {
        URL.revokeObjectURL(photoToDelete.croppedUrl)
      }

      setPhotos((prev) => prev.filter((_, i) => i !== index))

      // Корректируем currentIndex при необходимости
      if (currentIndex >= index && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    },
    [photos, currentIndex]
  )

  // const onUploadFile = useCallback(
  //   (files: File | null) => {
  //     const newFiles: File[] = Array.from(files)
  //     // const files = [file]
  //     // if (files.length === 0) return
  //
  //     // const totalCount = photos.length + files.length
  //     // if (totalCount > MAX_IMAGES) {
  //     //   setError(`Maximum ${MAX_IMAGES} images allowed`)
  //     //   return
  //     // }
  //
  //     const newPhotosPromises = newFiles.map(async (file, index) => {
  //       const url = URL.createObjectURL(file)
  //       return {
  //         photoId: `${Date.now()}-${photos.length + index}`,
  //         file,
  //         originalUrl: url,
  //         isEdited: false,
  //       }
  //     })
  //
  //     Promise.all(newPhotosPromises).then((newPhotos) => {
  //       setPhotos((prev) => [...prev, ...newPhotos])
  //       // Переключаемся на первое новое изображение
  //       setCurrentIndex(photos.length)
  //     })
  //
  //     // Оповещаем родительский компонент о новых файлах
  //     if (onSelectFiles) {
  //       onSelectFiles(newFiles)
  //     }
  //
  //     // Сбрасываем input
  //     // e.target.value = ''
  //   },
  //   [photos]
  // )
  //
  // useEffect(() => {
  //   if (file) {
  //     onUploadFile(file)
  //     console.log('файл загружен и провалидирован')
  //   }
  // }, [file, onSelectFile])

  const onUploadFile = useCallback(
    (uploadedFile: File) => {
      // Хук useImageUpload уже выполнил валидацию
      if (!uploadedFile) return

      const url = URL.createObjectURL(uploadedFile)

      const newPhoto = {
        photoId: `${Date.now()}-${photos.length}`,
        file: uploadedFile,
        originalUrl: url,
        isEdited: false,
        // Дополнительная информация, если нужно
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
      }

      setPhotos((prev) => [...prev, newPhoto])
      setCurrentIndex(photos.length)

      if (onSelectFiles) {
        onSelectFiles([uploadedFile])
      }

      // Можно добавить уведомление об успешной загрузке
      console.log(`Added photo: ${uploadedFile.name} (${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)`)
    },
    [photos]
  )

  // Обработка нового файла
  useEffect(() => {
    if (file) {
      onUploadFile(file)
    }
  }, [file])

  const handleSaveCrop = useCallback(async () => {
    if (photos.length === 0) {
      return
    }

    try {
      const croppedImagesPromises = photos.map(async (photo) => {
        if (!photo.croppedAreaPixels) {
          // Если фото не редактировалось, возвращаем оригинал
          return photo.file
        }

        const croppedImageBlob = await getCroppedImg(photo.originalUrl, photo.croppedAreaPixels)

        return new File([croppedImageBlob], `cropped-${photo.file.name}`, {
          type: croppedImageBlob.type,
          lastModified: Date.now(),
        })
      })

      const croppedImages = await Promise.all(croppedImagesPromises)
      onCropComplete(croppedImages)
      onNext()
    } catch (err) {
      console.error('Error saving cropped images:', err)
    }
  }, [photos, onCropComplete, onNext])

  const currentPhoto = photos[currentIndex]

  const canSave = photos.length > 0

  return (
    <>
      <ModalHeader currentStep={currentStep} onBack={onBack} onNext={handleSaveCrop} disabled={!canSave} />

      <div className={s.contentCropping}>
        <div className={s.contentError}>
          {error && (
            <Typography variant={'bold_text_14'} className={s.error}>
              {error}
            </Typography>
          )}
        </div>
        <div className={s.controlsSection}>
          <div className={s.aspectSection}>
            <div className={s.aspectTitle}>Aspect Ratio</div>
            <div className={s.aspectButtons}>
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.label}
                  className={`${s.aspectButton} ${selectedAspect.value === ratio.value ? s.active : ''}`}
                  onClick={() => handleAspectChange(ratio)}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <div className={s.previewSection}>
            <div className={s.previewContainer}>
              {croppedPreviewUrl ? (
                <img
                  src={croppedPreviewUrl}
                  alt="Cropped preview"
                  className={s.previewImage}
                  style={{ aspectRatio: selectedAspect.value }}
                />
              ) : (
                currentPhoto?.originalUrl && <div className={s.previewPlaceholder}>Loading...</div>
              )}
            </div>
          </div>
        </div>

        <div className={s.galleryContainer}>
          {photos.map((photo, index) => (
            <div
              key={photo.photoId}
              className={`${s.galleryItem} ${index === currentIndex ? s.active : ''}`}
              onClick={() => handleSelectPhoto(index)}
            >
              <img
                src={photo.croppedUrl || photo.originalUrl}
                alt={`Preview ${index + 1}`}
                className={s.galleryImage}
              />
              <div className={s.galleryOverlay}>
                <div className={s.photoNumber}>{index + 1}</div>
                {photo.isEdited && <div className={s.editedBadge}>✓</div>}
                <button
                  className={s.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeletePhoto(index)
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}

          {photos.length < MAX_IMAGES && (
            <label className={s.galleryItemAdd}>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={onSelectFile}
                className={s.hiddenInput}
                multiple
              />
              <PlusCircleIcon className={s.uploadIcon} />
              <span>Upload ({MAX_IMAGES - photos.length} left)</span>
            </label>
          )}
        </div>

        <div className={s.zoomContent}>
          <h3>Crop and Zoom Controls</h3>
          <div className={s.imageSection}>
            <div className={s.imageContainer}>
              {currentPhoto?.originalUrl && (
                <Cropper
                  image={currentPhoto.originalUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={selectedAspect.value}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropCompleteHandler}
                  classes={{ containerClassName: s.cropperContainer }}
                />
              )}
            </div>

            <div className={s.zoomControls}>
              <div className={s.zoomLabel}>Zoom: {zoom.toFixed(1)}x</div>
              <div className={s.zoomSliderWrapper}>
                <button className={s.zoomButton} onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM}>
                  −
                </button>
                <input
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={ZOOM_STEP}
                  value={zoom}
                  onChange={handleZoomChange}
                  className={s.zoomSlider}
                />
                <button className={s.zoomButton} onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
