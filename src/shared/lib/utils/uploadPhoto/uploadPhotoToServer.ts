import { UploadedPhotoType } from '@/widgets/CreatPost/CreatePostModal/Publication/Publication'

export const uploadPhotoToServer = async (file: File, index: number): Promise<UploadedPhotoType> => {
  // Временно пока нет users
  // Для проверки создания поста, меняем userId на свой
  const userId = 'dd4b0337-9ffe-48c0-b10b-10fdf0263a23'

  try {
    const formData = new FormData()
    formData.append('photo', file)
    formData.append('userId', userId)

    // formData.append('userId', id)

    const response = await fetch('https://gateway.traineegramm.ru/api/v1/photos/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    // console.log('Upload response:', data)

    if (!data.success || !data.photo) {
      throw new Error('Invalid response structure from server')
    }
    const { photo } = data
    return {
      photoId: photo.id,
      s3Key: photo.s3Key,
      url: photo.url,
    }
  } catch (error) {
    console.error(`Error uploading photo ${index + 1}:`, error)
    throw error
  }
}
