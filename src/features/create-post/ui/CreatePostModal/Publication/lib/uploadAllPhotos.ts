import { uploadPhotoToServer } from '@/features/create-post/model/api/uploadPhotoToServer'
import { UploadedPhotoType } from '@/features/create-post/ui/CreatePostModal/Publication/types'

// Загрузка всех фото на сервер
export const uploadAllPhotos = async (
  images: File[],
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>,
  setUploadedPhotos: React.Dispatch<React.SetStateAction<UploadedPhotoType[]>>
): Promise<UploadedPhotoType[]> => {
  if (images.length === 0) {
    return []
  }

  setIsUploading(true)
  setUploadError(null)

  try {
    // console.log(`Starting upload of ${images.length} photos...`)

    const uploadPromises = images.map((file, index) => uploadPhotoToServer(file, index))

    const uploaded = await Promise.all(uploadPromises)

    // console.log('Photos uploaded successfully:', uploaded)
    setUploadedPhotos(uploaded)
    return uploaded
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload photos'
    setUploadError(errorMessage)
    console.error('Error uploading photos:', error)
    throw error
  } finally {
    setIsUploading(false)
  }
}
