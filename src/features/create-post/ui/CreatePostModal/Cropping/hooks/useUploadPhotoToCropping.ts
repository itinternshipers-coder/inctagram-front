import { PhotoType } from '@/features/create-post/ui/CreatePostModal/Cropping/types'
import { useCallback } from 'react'

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
  const uploadFile = useCallback(
    (file: File | null) => {
      if (!file) return

      const url = URL.createObjectURL(file)

      const newPhoto: PhotoType = {
        photoId: `${Date.now()}-${photos.length}`,
        file,
        originalUrl: url,
        isEdited: false,
      }

      setPhotos([...photos, newPhoto])
      setCurrentIndex(photos.length)
    },
    [photos, setPhotos, setCurrentIndex]
  )

  return { uploadFile }
}
