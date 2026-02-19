import { PhotoType } from '../lib/types'
import { RefObject } from 'react'

export const clearUrlForUnmount = (photosRef: RefObject<PhotoType[] | null>): void => {
  if (!photosRef.current) return

  photosRef.current.forEach((photo) => {
    try {
      if (photo.url?.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url)
      }
    } catch (e) {
      // Игнорируем ошибки при очистке
    }
  })
}
