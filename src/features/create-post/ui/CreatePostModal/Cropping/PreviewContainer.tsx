import { AspectRatio, PhotoType } from './types'
import s from './Cropping.module.scss'

type PreviewContainerProps = {
  photos: PhotoType[]
  currentPhoto: PhotoType
  croppedPreviewUrl: string | null
  selectedAspect: AspectRatio
}

export const PreviewContainer = ({
  photos,
  currentPhoto,
  croppedPreviewUrl,
  selectedAspect,
}: PreviewContainerProps) => {
  return (
    <div className={s.previewSection}>
      <div className={s.previewContainer}>
        {photos.length > 0 ? (
          currentPhoto.originalUrl && croppedPreviewUrl ? (
            <img
              src={croppedPreviewUrl}
              alt=" Loading... Image preview"
              className={s.previewImage}
              style={{ aspectRatio: selectedAspect.value }}
            />
          ) : (
            currentPhoto?.originalUrl && <div className={s.previewPlaceholder}>Loading...</div>
          )
        ) : (
          <div className={s.previewPlaceholder}>No photos uploaded</div>
        )}
      </div>
    </div>
  )
}
