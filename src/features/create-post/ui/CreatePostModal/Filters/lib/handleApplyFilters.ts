// Применение фильтров ко всем изображениям и переход дальше

import { ExtendedPhotoType } from '@/features/create-post/ui/CreatePostModal/Filters/types'
import { getFilterCSS } from '@/features/create-post/ui/CreatePostModal/Filters/utils/getFilters'

export const handleApplyFilters = async (
  processedImagesRef: React.RefObject<ExtendedPhotoType[]>,
  setIsApplyingAll: React.Dispatch<React.SetStateAction<boolean>>,
  onNext: (() => void) | undefined,
  onFilterApply: ((filteredImages: File[]) => void) | undefined
) => {
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
