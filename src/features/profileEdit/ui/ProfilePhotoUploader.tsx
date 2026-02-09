'use client'

import { useRef } from 'react'
import s from './ProfilePhotoUploader.module.scss'
import Image from 'next/image'
import { ImageOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { useImageUpload } from '@/features/uploadImage/useImageUpload'

export default function ProfilePhotoUploader() {
  const { preview, error, onSelectFile, accept } = useImageUpload({
    maxSizeMB: 10,
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={s.profilePhotoUploader}>
      <div className={s.avatarContainer}>
        {preview ? (
          <>
            <Image src={preview} alt="Profile" width={192} height={192} />
          </>
        ) : (
          <div className={s.placeholder}>
            <ImageOutlineIcon width={30} height={30} />
          </div>
        )}
      </div>

      <Button type="button" variant="tertiary" onClick={triggerFileInput}>
        Select Profile Photo
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={onSelectFile}
        className={s.fileInput}
        aria-label="Upload profile photo"
      />

      {error && <div className={s.errorMessage}>{error}</div>}
    </div>
  )
}
