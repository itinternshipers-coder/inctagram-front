'use client'

import { ModalSteps } from '@/features/create-post/model/types/modalSteps'
import s from './Filters.module.scss'
import { applyFilterToImage } from './utils/applyFilterToImage'
import { FiltersToImage } from './FiltersToImage'
import { ExtendedPhotoType } from './types'
import { getFilterCSS } from './utils/getFilters'
import { SlideViewerImage } from './SlideViewerImage'
import { ModalHeader } from '@/features/create-post/ui/CreatePostModal/ModalHeader/ModalHeader'
import { useCallback, useEffect, useRef, useState } from 'react'

type FiltersProps = {
  images: File[]
  onFilterApply?: (filteredImages: File[]) => void
  onBack?: () => void
  onNext?: () => void
  currentStep: ModalSteps
}
export const Filters = ({ images, onFilterApply, onBack, onNext, currentStep }: FiltersProps) => {
  const [processedImages, setProcessedImages] = useState<ExtendedPhotoType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isApplyingAll, setIsApplyingAll] = useState(false)
  const processedImagesRef = useRef<ExtendedPhotoType[]>([])
  // Инициализация изображений
  useEffect(() => {
    if (!images || images.length === 0) {
      // Очищаем предыдущие URL перед очисткой состояния
      processedImagesRef.current.forEach((img) => {
        try {
          if (img.url?.startsWith('blob:')) {
            URL.revokeObjectURL(img.url)
          }
          if (img.originalUrl?.startsWith('blob:') && img.originalUrl !== img.url) {
            URL.revokeObjectURL(img.originalUrl)
          }
          if (img.filteredUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(img.filteredUrl)
          }
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      })
      processedImagesRef.current = []
      setProcessedImages([])
      return
    }

    const initializeImages = async () => {
      // Очищаем предыдущие URL перед созданием новых
      processedImagesRef.current.forEach((img) => {
        try {
          if (img.url?.startsWith('blob:')) {
            URL.revokeObjectURL(img.url)
          }
          if (img.originalUrl?.startsWith('blob:') && img.originalUrl !== img.url) {
            URL.revokeObjectURL(img.originalUrl)
          }
          if (img.filteredUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(img.filteredUrl)
          }
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      })

      const newProcessedImages: ExtendedPhotoType[] = await Promise.all(
        images.map(async (file) => {
          const url = URL.createObjectURL(file)
          return {
            file,
            url,
            originalUrl: url,
            selectedFilter: 'none',
            isProcessing: false,
          }
        })
      )

      processedImagesRef.current = newProcessedImages
      setProcessedImages(newProcessedImages)
      setCurrentIndex(0)
    }

    initializeImages()

    return () => {
      // Очистка URL при размонтировании или изменении images
      processedImagesRef.current.forEach((img) => {
        try {
          if (img.url?.startsWith('blob:')) {
            URL.revokeObjectURL(img.url)
          }
          if (img.originalUrl?.startsWith('blob:') && img.originalUrl !== img.url) {
            URL.revokeObjectURL(img.originalUrl)
          }
          if (img.filteredUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(img.filteredUrl)
          }
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      })
      processedImagesRef.current = []
    }
  }, [images])

  // Обработчик выбора фильтра
  const handleSelectFilter = useCallback(
    async (filterId: string) => {
      // Сначала обновляем selectedFilter
      setProcessedImages((prev) => {
        const updated = prev.map((img, i) => (i === currentIndex ? { ...img, selectedFilter: filterId } : img))
        processedImagesRef.current = updated
        return updated
      })

      // Затем применяем фильтр
      await applyFilterToImage(currentIndex, filterId, processedImagesRef, setProcessedImages)
    },
    [currentIndex]
  )

  // Применение фильтров ко всем изображениям и переход дальше
  const handleApplyFilters = async () => {
    if (processedImagesRef.current.length === 0) {
      if (onNext) onNext()
      return
    }

    setIsApplyingAll(true)

    try {
      // Применяем фильтры ко всем изображениям
      const filteredFilesPromises = processedImagesRef.current.map(async (imageData) => {
        if (imageData.selectedFilter === 'none') {
          // Если фильтр не выбран, возвращаем оригинал
          return imageData.file
        }

        // Если уже есть filteredUrl, создаем файл из него
        if (imageData.filteredUrl) {
          const response = await fetch(imageData.filteredUrl)
          const blob = await response.blob()

          return new File([blob], `filtered-${imageData.file.name}`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
        }

        // Иначе применяем фильтр заново (на случай если filteredUrl был очищен)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) throw new Error('Canvas context not available')

        const img = new Image()
        await new Promise<void>((resolve, reject) => {
          const handleLoad = () => {
            cleanup()
            resolve()
          }
          const handleError = (error: Event | string) => {
            cleanup()
            reject(error)
          }
          const cleanup = () => {
            img.removeEventListener('load', handleLoad)
            img.removeEventListener('error', handleError)
          }
          img.addEventListener('load', handleLoad)
          img.addEventListener('error', handleError)
          img.src = imageData.originalUrl
        })

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        ctx.filter = getFilterCSS(imageData.selectedFilter)
        ctx.drawImage(img, 0, 0)

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.5)
        })

        return new File([blob], `filtered-${imageData.file.name}`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })
      })

      const filteredFiles = await Promise.all(filteredFilesPromises)

      // Передаем отфильтрованные файлы родителю
      if (onFilterApply) {
        onFilterApply(filteredFiles)
      }

      // Переход к следующему шагу
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setIsApplyingAll(false)
    }
  }

  const currentImage = processedImages[currentIndex]

  return (
    <div className={s.containerModalRectangularFilters}>
      <ModalHeader currentStep={currentStep} onBack={onBack} onNext={handleApplyFilters} disabled={isApplyingAll} />
      <div className={s.contentFilters}>
        {/* Image preview section with navigation */}
        <div className={s.previewSection}>
          {currentImage && (
            <div
              className={`${s.imageWrapper} ${
                s[
                  `filter${currentImage.selectedFilter.charAt(0).toUpperCase() + currentImage.selectedFilter.slice(1)}`
                ] || ''
              }`}
            >
              {/* Основное изображение с кнопками навигации */}
              <div className={s.previewContainer}>
                <img src={currentImage.url} alt={`Preview ${currentIndex + 1}`} className={s.previewImage} />

                {/* Кнопки навигации (только если больше 1 изображения) */}
                {processedImages.length > 1 && (
                  <SlideViewerImage
                    currentImage={currentImage}
                    processedImagesRef={processedImagesRef}
                    setCurrentIndex={setCurrentIndex}
                  />
                )}
                <div className={s.dotsIndicator}>
                  {processedImages.map((_, index) => (
                    <span
                      key={index}
                      className={`${s.dot} ${index === currentIndex ? s.active : ''}`}
                      onClick={() => setCurrentIndex(index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Filters selection */}
        <div className={s.filtersSection}>
          <h3>Select Filter for Image {currentIndex + 1}:</h3>
          <div className={s.filters}>
            {
              <FiltersToImage
                currentImage={currentImage}
                isApplyingAll={isApplyingAll}
                onFilterToImage={(filterId) => handleSelectFilter(filterId)}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
