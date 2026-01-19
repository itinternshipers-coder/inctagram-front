import { PhotoType } from '@/features/create-post/ui/CreatePostModal/Cropping/types'

type PhotoDeleteResult = {
  newPhotos: PhotoType[]
  newCurrentIndex: number
}

export const photoDelete = (photos: PhotoType[], index: number, currentIndex: number): PhotoDeleteResult => {
  const photoToDelete = photos[index]
  if (!photoToDelete) {
    return { newPhotos: photos, newCurrentIndex: currentIndex }
  }

  // Очистка URL
  URL.revokeObjectURL(photoToDelete.originalUrl)
  if (photoToDelete.croppedUrl) {
    URL.revokeObjectURL(photoToDelete.croppedUrl)
  }

  const newPhotos = photos.filter((_, i) => i !== index)

  // Вычисление нового currentIndex
  let newCurrentIndex = currentIndex
  if (newPhotos.length === 0) {
    newCurrentIndex = 0
  } else if (currentIndex >= index && currentIndex > 0) {
    newCurrentIndex = currentIndex - 1
  }

  return { newPhotos, newCurrentIndex }
}
