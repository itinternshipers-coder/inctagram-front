import { Area } from 'react-easy-crop'

export type AspectRatio = {
  value: number | undefined
  label: string
}

export type PhotoType = {
  photoId: string
  file: File
  originalUrl: string
  croppedUrl?: string
  isEdited?: boolean
  croppedAreaPixels?: Area
}
