export type PhotoType = {
  photoId: string
  url: string
  order: number
  createdAt: string
}

export type UploadedPhotoType = {
  photoId: string
  s3Key: string
  url: string
}
