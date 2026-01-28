import { PhotoType } from '@/features/create-post/ui/CreatePostModal/Cropping/types'
import { useCallback, useRef } from 'react'

type UseUploadFileReturn = {
  uploadFile: (file: File | null) => void
}

type UseUploadFileProps = {
  photos: PhotoType[]
  setPhotos: (photos: PhotoType[]) => void
  setCurrentIndex: (index: number) => void
}

export const useUploadPhotoToCropping = ({
  photos,
  setPhotos,
  setCurrentIndex,
}: UseUploadFileProps): UseUploadFileReturn => {
  // Храним ref на текущие photos для правильной очистки
  const photosRef = useRef<PhotoType[]>(photos)

  // Обновляем ref при изменении photos
  photosRef.current = photos

  const uploadFile = useCallback(
    (file: File | null) => {
      if (!file) return

      const url = URL.createObjectURL(file)

      const newPhoto: PhotoType = {
        photoId: `${Date.now()}-${photosRef.current.length}`,
        file,
        originalUrl: url,
        isEdited: false,
      }

      const updatedPhotos = [...photosRef.current, newPhoto]
      photosRef.current = updatedPhotos
      setPhotos(updatedPhotos)
      setCurrentIndex(photosRef.current.length - 1)
    },
    [setPhotos, setCurrentIndex]
  )

  return { uploadFile }
}
