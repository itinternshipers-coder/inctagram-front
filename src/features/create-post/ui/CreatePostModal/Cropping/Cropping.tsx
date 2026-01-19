'use client'

import { ModalSteps } from '@/features/create-post/model/types/modalSteps'
import { useCroppingHandlers } from './hooks/useCroppingHandlers'
import { useUploadPhotoToCropping } from './hooks/useUploadPhotoToCropping'
import { photoDelete } from './utils/photoDeleteUtils'
import { ModalHeader } from '@/features/create-post/ui/CreatePostModal/ModalHeader/ModalHeader'
import { useImageUpload } from '@/features/uploadImage/useImageUpload'
import { PlusCircleIcon } from '@/shared/icons/svgComponents'
import getCroppedImg from '@/shared/lib/image/canvasUtils'
import { Typography } from '@/shared/ui/Typography/Typography'
import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { ASPECT_RATIO_OPTIONS, CROPPING_IMAGES_CONSTANTS } from './constants'
import s from './Cropping.module.scss'
import { AspectRatio, PhotoType } from './types'

type CroppingProps = {
  images: File[] // Массив изображений
  onCropComplete?: (croppedImages: File[]) => void
  onNext?: () => void
  onBack?: () => void
  currentStep: ModalSteps
}

export const Cropping = ({
  images,
  onCropComplete = () => {},
  onNext = () => {},
  onBack = () => {},
  currentStep,
}: CroppingProps) => {
  const [photos, setPhotos] = useState<PhotoType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>(ASPECT_RATIO_OPTIONS[0])
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null)
  const cropDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { ZOOM, UI } = CROPPING_IMAGES_CONSTANTS

  const { file, error, onSelectFile } = useImageUpload({
    maxSizeMB: 10, // Ограничение 10MB
    allowedTypes: ['image/png', 'image/jpeg'],
  })
  const { handleSaveCrop } = useCroppingHandlers({
    photos,
    onCropComplete,
    onNext,
  })
  const { uploadFile } = useUploadPhotoToCropping({
    photos,
    setPhotos,
    setCurrentIndex,
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

    // Явная проверка на существование фото
    if (!currentPhoto) return

    if (!currentPhoto?.croppedAreaPixels || !currentPhoto.originalUrl) return

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
    setZoom((prev) => Math.min(prev + ZOOM.STEP, ZOOM.MAX))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM.STEP, ZOOM.MIN))
  }, [])

  const handleSelectPhoto = useCallback((index: number) => {
    setCurrentIndex(index)
    // Сбрасываем состояние кропа для нового изображения
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }, [])

  const handleDeletePhoto = useCallback(
    (index: number) => {
      const { newPhotos, newCurrentIndex } = photoDelete(photos, index, currentIndex)
      setPhotos(newPhotos)
      setCurrentIndex(newCurrentIndex)
    },
    [photos, currentIndex, setPhotos, setCurrentIndex]
  )

  // Обработка нового файла
  useEffect(() => {
    if (file) {
      uploadFile(file)
    }
  }, [file])

  const currentPhoto = photos[currentIndex]
  const canSave = photos.length > 0

  return (
    <div className={s.containerModalSquareCropping}>
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
              {ASPECT_RATIO_OPTIONS.map((ratio) => (
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

          {photos.length < UI.LIMITS.MAX_IMAGES && (
            <label className={s.galleryItemAdd}>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={onSelectFile}
                className={s.hiddenInput}
                multiple
              />
              <PlusCircleIcon className={s.uploadIcon} />
              <span>Upload ({UI.LIMITS.MAX_IMAGES - photos.length} left)</span>
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
                <button className={s.zoomButton} onClick={handleZoomOut} disabled={zoom <= ZOOM.MIN}>
                  −
                </button>
                <input
                  type="range"
                  min={ZOOM.MIN}
                  max={ZOOM.MAX}
                  step={ZOOM.STEP}
                  value={zoom}
                  onChange={handleZoomChange}
                  className={s.zoomSlider}
                />
                <button className={s.zoomButton} onClick={handleZoomIn} disabled={zoom >= ZOOM.MAX}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
