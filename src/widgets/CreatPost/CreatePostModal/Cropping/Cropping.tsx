'use client'

import getCroppedImg from '@/shared/lib/utils/image/canvasUtils'
import { Button } from '@/shared/ui/Button/Button'
import { Typography } from '@/shared/ui/Typography/Typography'
import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import s from 'src/widgets/CreatPost/CreatePostModal/Cropping/Cropping.module.scss'

type AspectRatio = {
  value: number
  label: string
}

type CroppingProps = {
  image: File | null // Одно изображение
  onCropComplete?: (croppedImage: File) => void
  onNext?: () => void
  onBack?: () => void
}

const ASPECT_RATIOS: AspectRatio[] = [
  { value: 1 / 1, label: '1:1' },
  { value: 4 / 5, label: '4:5' },
  { value: 16 / 9, label: '16:9' },
]

export const Cropping = ({
  image, // одно изображение
  onCropComplete,
  onNext,
  onBack,
}: CroppingProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>(ASPECT_RATIOS[0])
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  const cropDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Загрузка изображения
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setImageUrl(url)

      return () => {
        URL.revokeObjectURL(url)
        if (croppedPreviewUrl) {
          URL.revokeObjectURL(croppedPreviewUrl)
        }
      }
    } else {
      setImageUrl(null)
      setCroppedPreviewUrl(null)
    }
  }, [image])

  // Обновление предпросмотра
  const updateCroppedPreview = useCallback(async () => {
    if (!imageUrl || !croppedAreaPixels || !image) return

    setIsGeneratingPreview(true)

    try {
      const croppedImageBlob = await getCroppedImg(imageUrl, croppedAreaPixels)
      const previewUrl = URL.createObjectURL(croppedImageBlob)

      if (croppedPreviewUrl) {
        URL.revokeObjectURL(croppedPreviewUrl)
      }

      setCroppedPreviewUrl(previewUrl)
    } catch (e) {
      console.error('Error updating preview:', e)
    } finally {
      setIsGeneratingPreview(false)
    }
  }, [imageUrl, croppedAreaPixels, image, croppedPreviewUrl])

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

  const handleNext = async () => {
    try {
      if (!imageUrl || !croppedAreaPixels || !image) return

      const croppedImageBlob = await getCroppedImg(imageUrl, croppedAreaPixels)

      const croppedImageFile = new File([croppedImageBlob], `cropped-${image.name}`, { type: 'image/png' })

      if (onCropComplete) {
        onCropComplete(croppedImageFile)
      }

      if (onNext) {
        onNext()
      }
    } catch (e) {
      console.error('Error cropping image:', e)
    }
  }

  if (!imageUrl || !image) {
    return (
      <div className={s.containerCropping}>
        <div className={s.noImages}>
          <Typography variant="h2">No image selected</Typography>
          <Button variant="primary" onClick={onBack}>
            Back to upload
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={s.containerCropping}>
      {/* Header */}
      {/*<div className={s.header}>*/}
      {/*  <div className={s.headerLeft}>*/}
      {/*    <button className={s.backButton} onClick={onBack}>*/}
      {/*      <ArrowIosBackOutlineIcon />*/}
      {/*    </button>*/}
      {/*    <Typography variant="h1" className={s.title}>*/}
      {/*      Cropping*/}
      {/*    </Typography>*/}
      {/*  </div>*/}
      {/*  <Button*/}
      {/*    variant="link"*/}
      {/*    className={s.nextButton}*/}
      {/*    onClick={handleNext}*/}
      {/*    disabled={!croppedAreaPixels || isGeneratingPreview}*/}
      {/*  >*/}
      {/*    {isGeneratingPreview ? 'Processing...' : 'Next'}*/}
      {/*  </Button>*/}
      {/*</div>*/}

      {/* Main Content */}
      <div className={s.content}>
        {/* Left Side - Image */}
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

          {/* Zoom Controls */}
          <div className={s.zoomControls}>
            <Typography variant="h3" className={s.zoomLabel}>
              Zoom: {zoom.toFixed(1)}x
            </Typography>
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

        {/* Right Side - Controls */}
        <div className={s.controlsSection}>
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
                <div className={s.previewPlaceholder}>
                  <Typography variant="h3" color="secondary">
                    It, sed do eiusmod tempor <br />
                    am, quis nostrud exercitation
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Aspect Ratios */}
          <div className={s.aspectSection}>
            <Typography variant="h3" className={s.aspectTitle}>
              Aspect Ratio
            </Typography>
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
        </div>
      </div>
    </div>
  )
}
