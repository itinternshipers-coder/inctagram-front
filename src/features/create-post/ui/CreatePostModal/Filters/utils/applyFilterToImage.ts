// Применение фильтра к конкретному изображению
import { ExtendedPhotoType } from '../types'
import { getFilterCSS } from './getFilters'

export const applyFilterToImage = async (
  index: number,
  filterId: string,
  processedImagesRef: React.RefObject<ExtendedPhotoType[]>,
  setProcessedImages: React.Dispatch<React.SetStateAction<ExtendedPhotoType[]>>
) => {
  const imageData = processedImagesRef.current[index]
  if (!imageData) return null

  setProcessedImages((prev) => {
    const updated = prev.map((img, i) => (i === index ? { ...img, isProcessing: true } : img))
    processedImagesRef.current = updated
    return updated
  })

  try {
    // Создаем canvas для применения фильтра
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context not available')
    }

    // Загружаем ОРИГИНАЛЬНОЕ изображение (всегда из originalUrl)
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

    setProcessedImages((prev) => {
      const updated = prev.map((imgData, i) => {
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
      processedImagesRef.current = updated
      return updated
    })

    return filteredUrl
  } catch (error) {
    console.error('Error applying filter:', error)
    setProcessedImages((prev) => {
      const updated = prev.map((imgData, i) => (i === index ? { ...imgData, isProcessing: false } : imgData))
      processedImagesRef.current = updated
      return updated
    })
    return null
  }
}
