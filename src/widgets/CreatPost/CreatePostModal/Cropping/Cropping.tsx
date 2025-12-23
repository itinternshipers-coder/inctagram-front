'use client'

import getCroppedImg from '@/shared/lib/utils/image/canvasUtils'
import { ModalStep } from '@/widgets/CreatPost/CreatePostModal/CreatePostModal'
import { ModalHeader } from '@/widgets/CreatPost/CreatePostModal/ModalHeader'
import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import s from 'src/widgets/CreatPost/CreatePostModal/Cropping/Cropping.module.scss'

type AspectRatio = {
  value: number
  label: string
}

type CroppingProps = {
  image: File // Одно изображение
  onCropComplete?: (croppedImage: File) => void
  onNext?: () => void
  onBack?: () => void
  currentStep: ModalStep
}

const ASPECT_RATIOS: AspectRatio[] = [
  { value: 1, label: '1:1' },
  { value: 4 / 5, label: '4:5' },
  { value: 16 / 9, label: '16:9' },
]

export const Cropping = ({
  image, // одно изображение
  onCropComplete,
  onNext,
  onBack,
  currentStep,
}: CroppingProps) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>(ASPECT_RATIOS[0])
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  const cropDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Загрузка изображения
  useEffect(() => {
    const url = URL.createObjectURL(image)
    setImageUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [image]) // Убрал croppedPreviewUrl из зависимостей

  // Очистка preview URL при размонтировании
  useEffect(() => {
    return () => {
      if (croppedPreviewUrl) {
        URL.revokeObjectURL(croppedPreviewUrl)
      }
    }
  }, [croppedPreviewUrl]) // ← Очистка при каждом изменении

  // Обновление предпросмотра с useCallback
  const updateCroppedPreview = useCallback(async () => {
    if (!croppedAreaPixels) return

    setIsGeneratingPreview(true)

    try {
      const croppedImageBlob = await getCroppedImg(imageUrl, croppedAreaPixels)
      const previewUrl = URL.createObjectURL(croppedImageBlob)

      // Очищаем предыдущий preview
      setCroppedPreviewUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev)
        }
        return previewUrl
      })
    } catch (e) {
      console.error('Error updating preview:', e)
    } finally {
      setIsGeneratingPreview(false)
    }
  }, [imageUrl, croppedAreaPixels])

  // Дебаунс обновления предпросмотра
  useEffect(() => {
    if (cropDebounceRef.current) {
      clearTimeout(cropDebounceRef.current)
    }

    if (imageUrl && croppedAreaPixels && image) {
      cropDebounceRef.current = setTimeout(() => {
        updateCroppedPreview()
      }, 300)
    }

    return () => {
      if (cropDebounceRef.current) {
        clearTimeout(cropDebounceRef.current)
      }
    }
  }, [imageUrl, croppedAreaPixels, image, updateCroppedPreview])

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value))
  }

  const handleAspectChange = (ratio: AspectRatio) => {
    setSelectedAspect(ratio)
    setCrop({ x: 0, y: 0 })
    setCroppedAreaPixels(null)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 1))
  }
  const handleSaveCrop = async () => {
    if (!imageUrl || !croppedAreaPixels || !image || !onCropComplete) {
      console.error('Cannot save crop: missing data', {
        imageUrl: !!imageUrl,
        croppedAreaPixels: !!croppedAreaPixels,
        image: !!image,
        onCropComplete: !!onCropComplete,
      })

      return
    }

    try {
      const croppedImageBlob = await getCroppedImg(imageUrl, croppedAreaPixels)

      const croppedImageFile = new File([croppedImageBlob], `cropped-${image.name}`, {
        type: croppedImageBlob.type || 'image/png',
        lastModified: Date.now(),
      })

      onCropComplete(croppedImageFile)
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving cropped image:', error)
    }
  }

  const canSave = croppedAreaPixels && !isGeneratingPreview

  return (
    <>
      <ModalHeader currentStep={currentStep} onBack={onBack} onNext={handleSaveCrop} disabled={!canSave} />
      {/* Main Content */}
      <div className={s.contentAddPhoto}>
        <div className={s.controlsSection}>
          {/* Controls */}
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
          {/* Preview */}
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
                <div className={s.previewPlaceholder}>Loading...</div>
              )}
            </div>
          </div>
        </div>
        {/* Change Image */}
        <div className={s.zoomContent}>
          <h3>Zoom Controls</h3>
          <div className={s.imageSection}>
            <div className={s.imageContainer}>
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={selectedAspect.value}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropCompleteHandler}
                classes={{
                  containerClassName: s.cropperContainer,
                }}
              />
            </div>
            <div className={s.zoomControls}>
              <div className={s.zoomLabel}>Zoom: {zoom.toFixed(1)}x</div>
              <div className={s.zoomSliderWrapper}>
                <button className={s.zoomButton} onClick={handleZoomOut} disabled={zoom <= 1}>
                  −
                </button>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={handleZoomChange}
                  className={s.zoomSlider}
                />
                <button className={s.zoomButton} onClick={handleZoomIn} disabled={zoom >= 3}>
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
