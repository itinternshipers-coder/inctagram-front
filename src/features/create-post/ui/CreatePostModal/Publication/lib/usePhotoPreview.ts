'use no memo'

import { useEffect, useRef, useState } from 'react'
import { clearUrlForUnmount } from '../utils/clearUrlForUnmount'
import { PhotoType } from './types'

function convertFilesToPhotos(files: File[]): PhotoType[] {
  return files.map((file, index) => ({
    photoId: `temp-${Date.now()}-${index}`,
    url: URL.createObjectURL(file),
    order: index,
    createdAt: new Date().toISOString(),
  }))
}

export function usePhotoPreview(images: File[]) {
  const [photos, setPhotos] = useState<PhotoType[]>([])
  const photosRef = useRef<PhotoType[]>([])

  useEffect(() => {
    clearUrlForUnmount(photosRef)
    photosRef.current = []

    if (!images || images.length === 0) {
      setPhotos([])
      return
    }

    const converted = convertFilesToPhotos(images)
    photosRef.current = converted
    setPhotos(converted)

    return () => {
      clearUrlForUnmount(photosRef)
      photosRef.current = []
    }
  }, [images])

  return { photos, photosRef }
}
