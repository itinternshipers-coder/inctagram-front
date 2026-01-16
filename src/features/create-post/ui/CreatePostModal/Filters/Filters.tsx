'use client'

import { ArrowIosBackOutlineIcon, ArrowIosForwardOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { ModalStep } from '@/features/create-post/ui/CreatePostModal/CreatePostModal'
import { ModalHeader } from '@/features/create-post/ui/CreatePostModal/ModalHeader/ModalHeader'
import { useCallback, useEffect, useState } from 'react'
import s from '@/features/create-post/ui/CreatePostModal/Filters/Filters.module.scss'

type FiltersProps = {
  images: File[]
  onFilterApply?: (filteredImages: File[]) => void
  onBack?: () => void
  onNext?: () => void
  currentStep: ModalStep
}

type ExtendedPhotoType = {
  file: File
  url: string
  originalUrl: string
  filteredUrl?: string
  selectedFilter: string
  isProcessing: boolean
}

const FILTERS = [
  { id: 'none', name: 'Original', className: s.filterNone },
  { id: 'grayscale', name: 'Grayscale', className: s.filterGrayscale },
  { id: 'sepia', name: 'Sepia', className: s.filterSepia },
  { id: 'vintage', name: 'Vintage', className: s.filterVintage },
  { id: 'colder', name: 'Colder', className: s.filterColder },
  { id: 'warmer', name: 'Warmer', className: s.filterWarmer },
]

export const Filters = ({ images, onFilterApply, onBack, onNext, currentStep }: FiltersProps) => {
  const [processedImages, setProcessedImages] = useState<ExtendedPhotoType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isApplyingAll, setIsApplyingAll] = useState(false)

  // Инициализация изображений
  useEffect(() => {
    if (!images || images.length === 0) {
      setProcessedImages([])
      return
    }

    const initializeImages = async () => {
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

      setProcessedImages(newProcessedImages)
      setCurrentIndex(0)
    }

    initializeImages()

    return () => {
      // Очистка URL при размонтировании
      processedImages.forEach((img) => {
        if (img.url?.startsWith('blob:')) {
          URL.revokeObjectURL(img.url)
        }
        if (img.originalUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(img.originalUrl)
        }
        if (img.filteredUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(img.filteredUrl)
        }
      })
    }
  }, [images])

  // Вспомогательная функция для CSS фильтров
  const getFilterCSS = useCallback((filterId: string): string => {
    switch (filterId) {
      case 'grayscale':
        return 'grayscale(100%)'
      case 'sepia':
        return 'sepia(80%)'
      case 'vintage':
        return 'sepia(60%) contrast(1.1) brightness(1.1)'
      case 'colder':
        return 'brightness(1.1) hue-rotate(180deg) saturate(0.8)'
      case 'warmer':
        return 'brightness(1.1) sepia(30%) saturate(1.2)'
      default:
        return 'none'
    }
  }, [])

  // Применение фильтра к конкретному изображению
  const applyFilterToImage = useCallback(
    async (index: number, filterId: string) => {
      const imageData = processedImages[index]
      if (!imageData) return null

      setProcessedImages((prev) => prev.map((img, i) => (i === index ? { ...img, isProcessing: true } : img)))

      try {
        // Создаем canvas для применения фильтра
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('Canvas context not available')
        }

        // Загружаем ОРИГИНАЛЬНОЕ изображение (всегда из originalUrl)
        const img = new Image()
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = imageData.originalUrl
        })

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Применяем выбранный фильтр
        if (filterId !== 'none') {
          ctx.filter = getFilterCSS(filterId)
          ctx.drawImage(img, 0, 0)
        }

        // Конвертируем canvas в Blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.5)
        })

        // Создаем URL для предпросмотра
        const filteredUrl = URL.createObjectURL(blob)

        // Очищаем старый filteredUrl если был
        if (imageData.filteredUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(imageData.filteredUrl)
        }

        setProcessedImages((prev) =>
          prev.map((imgData, i) => {
            if (i === index) {
              // Определяем какой URL использовать для отображения
              const displayUrl = filterId !== 'none' ? filteredUrl : imgData.originalUrl

              return {
                ...imgData,
                selectedFilter: filterId,
                filteredUrl: filterId !== 'none' ? filteredUrl : undefined,
                url: displayUrl, // ← ВАЖНО: обновляем основной URL!
                isProcessing: false,
              }
            }
            return imgData
          })
        )

        return filteredUrl
      } catch (error) {
        console.error('Error applying filter:', error)
        setProcessedImages((prev) =>
          prev.map((imgData, i) => (i === index ? { ...imgData, isProcessing: false } : imgData))
        )
        return null
      }
    },
    [processedImages, getFilterCSS]
  )

  // Обработчик выбора фильтра
  const handleSelectFilter = useCallback(
    async (filterId: string) => {
      // Сначала обновляем selectedFilter
      setProcessedImages((prev) =>
        prev.map((img, i) => (i === currentIndex ? { ...img, selectedFilter: filterId } : img))
      )

      // Затем применяем фильтр
      await applyFilterToImage(currentIndex, filterId)
    },
    [currentIndex, applyFilterToImage]
  )

  // Применение фильтров ко всем изображениям и переход дальше
  const handleApplyFilters = async () => {
    if (processedImages.length === 0) {
      if (onNext) onNext()
      return
    }

    setIsApplyingAll(true)

    try {
      // Применяем фильтры ко всем изображениям
      const filteredFilesPromises = processedImages.map(async (imageData) => {
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
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
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

  // Функции для перелистывания изображений
  const goToPrevImage = useCallback(() => {
    if (processedImages.length <= 1) return
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : processedImages.length - 1))
  }, [processedImages.length])

  const goToNextImage = useCallback(() => {
    if (processedImages.length <= 1) return
    setCurrentIndex((prev) => (prev < processedImages.length - 1 ? prev + 1 : 0))
  }, [processedImages.length])

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
                  <>
                    <>
                      <Button
                        onClick={goToPrevImage}
                        className={`${s.navButton} ${s.prevButton}`}
                        variant="link"
                        disabled={currentImage.isProcessing}
                      >
                        <ArrowIosBackOutlineIcon width={48} height={48} />
                      </Button>
                      <Button
                        onClick={goToNextImage}
                        className={`${s.navButton} ${s.nextButton}`}
                        variant="link"
                        disabled={currentImage.isProcessing}
                      >
                        <ArrowIosForwardOutlineIcon width={48} height={48} />
                      </Button>
                    </>
                  </>
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
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                className={`${s.filterButton} ${currentImage?.selectedFilter === filter.id ? s.active : ''}`}
                onClick={() => handleSelectFilter(filter.id)}
                disabled={currentImage?.isProcessing || isApplyingAll}
              >
                <div className={`${s.filterPreview} ${filter.className}`}>
                  <div className={s.filterThumbnail} />
                </div>
                <span className={s.filterName}>{filter.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
