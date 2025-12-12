import { useImageUpload } from '@/features/uploadImage/useImageUpload'
import { ImageOutlineIcon } from '@/shared/icons/svgComponents'
import { Alert } from '@/shared/ui/Alert/Alert'
import { Button } from '@/shared/ui/Button/Button'
import { useEffect } from 'react'
import s from 'src/widgets/CreatPost/CreatePostModal/AddPhoto/AddPhoto.module.scss'

type AddPhotoProps = {
  onSelectImage: (file: File | null) => void
}

export const AddPhoto = ({ onSelectImage }: AddPhotoProps) => {
  const { file, preview, error, onSelectFile, clear } = useImageUpload({
    maxSizeMB: 10, // Ограничение 10MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
  })

  // Автоматически передаем файл при его выборе
  useEffect(() => {
    if (file) {
      onSelectImage(file)
    }
  }, [file, onSelectImage])

  return (
    <div className={s.containerAddPhoto}>
      <div className={s.uploadIcon}>
        <ImageOutlineIcon size={48} />
      </div>
      <div className={s.container}>
        {error && <Alert status={'error'} position={'top-left'} text={error}></Alert>}
        <label className={s.fileInputLabel}>
          <input type="file" accept="image/jpeg,image/png" onChange={onSelectFile} className={s.hiddenInput} />

          <Button as="span" variant="primary" className={s.buttonSpan}>
            Select from Computer
          </Button>
        </label>

        <Button className={s.button} variant="tertiary" onClick={() => alert('hello')}>
          Open Draft
        </Button>
      </div>
    </div>
  )
}
