import { PhotoType } from '@/features/create-post/ui/CreatePostModal/Cropping/types'
import getCroppedImg from '@/shared/lib/image/canvasUtils'
import { useCallback } from 'react'

type UseCroppingImageReturn = {
  handleSaveCrop: () => Promise<void>
}

type UseCroppingImageProps = {
  photos: PhotoType[]
  onCropComplete: (croppedImages: File[]) => void
  onNext: () => void
}

export const useCroppingHandlers = (options: UseCroppingImageProps): UseCroppingImageReturn => {
  const { photos, onCropComplete, onNext } = options

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

  return { handleSaveCrop }
}
