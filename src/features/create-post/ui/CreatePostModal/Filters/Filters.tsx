'use client'

import { ModalSteps } from '@/features/create-post/model/types/modalSteps'
import { handleApplyFilters } from './lib/handleApplyFilters'
import s from './Filters.module.scss'
import { applyFilterToImage } from './lib/applyFilterToImage'
import { FiltersToImage } from './FiltersToImage'
import { ExtendedPhotoType } from './types'
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
  // useEffect(() => {
  //   if (!images || images.length === 0) {
  //     // Очищаем предыдущие URL перед очисткой состояния
  //     processedImagesRef.current.forEach((img) => {
  //       try {
  //         if (img.url?.startsWith('blob:')) {
  //           URL.revokeObjectURL(img.url)
  //         }
  //         if (img.originalUrl?.startsWith('blob:') && img.originalUrl !== img.url) {
  //           URL.revokeObjectURL(img.originalUrl)
  //         }
  //         if (img.filteredUrl?.startsWith('blob:')) {
  //           URL.revokeObjectURL(img.filteredUrl)
  //         }
  //       } catch (e) {
  //         // Игнорируем ошибки при очистке
  //       }
  //     })
  //     processedImagesRef.current = []
  //     setProcessedImages([])
  //     return
  //   }
  //
  //   const initializeImages = async () => {
  //     // Очищаем предыдущие URL перед созданием новых
  //     processedImagesRef.current.forEach((img) => {
  //       try {
  //         if (img.url?.startsWith('blob:')) {
  //           URL.revokeObjectURL(img.url)
  //         }
  //         if (img.originalUrl?.startsWith('blob:') && img.originalUrl !== img.url) {
  //           URL.revokeObjectURL(img.originalUrl)
  //         }
  //         if (img.filteredUrl?.startsWith('blob:')) {
  //           URL.revokeObjectURL(img.filteredUrl)
  //         }
  //       } catch (e) {
  //         // Игнорируем ошибки при очистке
  //       }
  //     })
  //
  //     const newProcessedImages: ExtendedPhotoType[] = await Promise.all(
  //       images.map(async (file) => {
  //         const url = URL.createObjectURL(file)
  //         return {
  //           file,
  //           url,
  //           originalUrl: url,
  //           selectedFilter: 'none',
  //           isProcessing: false,
  //         }
  //       })
  //     )
  //
  //     processedImagesRef.current = newProcessedImages
  //     setProcessedImages(newProcessedImages)
  //     setCurrentIndex(0)
  //   }
  //
  //   initializeImages()
  //
  //   return () => {
  //     // Очистка URL при размонтировании или изменении images
  //     processedImagesRef.current.forEach((img) => {
  //       try {
  //         if (img.url?.startsWith('blob:')) {
  //           URL.revokeObjectURL(img.url)
  //         }
  //         if (img.originalUrl?.startsWith('blob:') && img.originalUrl !== img.url) {
  //           URL.revokeObjectURL(img.originalUrl)
  //         }
  //         if (img.filteredUrl?.startsWith('blob:')) {
  //           URL.revokeObjectURL(img.filteredUrl)
  //         }
  //       } catch (e) {
  //         // Игнорируем ошибки при очистке
  //       }
  //     })
  //     processedImagesRef.current = []
  //   }
  // }, [images])

  useEffect(() => {
    // Функция очистки URL
    const cleanupImages = (imagesToClean: ExtendedPhotoType[]) => {
      imagesToClean.forEach((img) => {
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
    }

    // Если нет изображений - очищаем
    if (!images || images.length === 0) {
      const previousImages = [...processedImagesRef.current]
      processedImagesRef.current = []

      // Используем setTimeout для асинхронной очистки
      Promise.resolve().then(() => {
        setProcessedImages([])
      })

      // Отложенная очистка URL
      requestAnimationFrame(() => {
        cleanupImages(previousImages)
      })

      return
    }

    // Инициализация изображений
    const initializeImages = async () => {
      // Сохраняем старые изображения для очистки
      const oldImages = [...processedImagesRef.current]

      // Очищаем ref перед созданием новых
      processedImagesRef.current = []

      // Очищаем состояние перед созданием новых изображений
      setProcessedImages([])

      // Создаем новые изображения
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

      // Устанавливаем новые значения
      processedImagesRef.current = newProcessedImages
      setProcessedImages(newProcessedImages)
      setCurrentIndex(0)

      // Очищаем старые URL после создания новых
      requestAnimationFrame(() => {
        cleanupImages(oldImages)
      })
    }

    initializeImages()

    // Cleanup при размонтировании
    return () => {
      const currentImages = [...processedImagesRef.current]
      processedImagesRef.current = []

      // Отложенная очистка URL
      requestAnimationFrame(() => {
        cleanupImages(currentImages)
      })
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

  const currentImage = processedImages[currentIndex]

  return (
    <div className={s.containerModalRectangularFilters}>
      <ModalHeader
        currentStep={currentStep}
        onBack={onBack}
        onNext={() => handleApplyFilters(processedImagesRef, setIsApplyingAll, onNext, onFilterApply)}
        disabled={isApplyingAll}
      />
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
