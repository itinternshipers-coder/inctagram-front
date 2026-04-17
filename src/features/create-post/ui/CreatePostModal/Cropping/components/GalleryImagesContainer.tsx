import { CROPPING_IMAGES_CONSTANTS } from '../lib/constants'
import s from '../Cropping.module.scss'
import { PhotoType } from '../lib/types'
import { PlusCircleIcon } from '@/shared/icons/svgComponents'
import Image from 'next/image'
import { ChangeEvent } from 'react'

type GalleryImagesProps = {
  photos: PhotoType[]
  currentIndex: number
  onChangeSelectPhoto: (index: number) => void
  onChangeDeletePhoto: (index: number) => void
  onSelectFile: (e: ChangeEvent<HTMLInputElement>) => void
}

export const GalleryImagesContainer = ({
  photos,
  currentIndex,
  onChangeSelectPhoto,
  onChangeDeletePhoto,
  onSelectFile,
}: GalleryImagesProps) => {
  const { UI } = CROPPING_IMAGES_CONSTANTS

  return (
    <>
      {photos.map((photo, index) => (
        <div
          key={photo.photoId}
          className={`${s.galleryItem} ${index === currentIndex ? s.active : ''}`}
          onClick={() => onChangeSelectPhoto(index)}
        >
          <Image src={photo.originalUrl} alt={`Preview ${index + 1}`} className={s.galleryImage} fill unoptimized />
          <div className={s.galleryOverlay}>
            <div className={s.photoNumber}>{index + 1}</div>
            {photo.isEdited && <div className={s.editedBadge}>✓</div>}
            <button
              className={s.deleteButton}
              onClick={(e) => {
                e.stopPropagation()
                onChangeDeletePhoto(index)
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}

      {photos.length < UI.LIMITS.MAX_IMAGES && (
        <label className={s.galleryItemAdd}>
          <input type="file" accept="image/jpeg,image/png" onChange={onSelectFile} className={s.hiddenInput} multiple />
          <PlusCircleIcon className={s.uploadIcon} />
          <span>Upload ({UI.LIMITS.MAX_IMAGES - photos.length} left)</span>
        </label>
      )}
    </>
  )
}
