'use client'

import { useState, useRef, useEffect } from 'react'
import s from './ProfilePhotoUploader.module.scss'
import Image from 'next/image'
import { CloseOutlineIcon, ImageOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { useImageUpload } from '@/features/uploadImage/useImageUpload'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useUploadAvatarMutation, useDeleteAvatarMutation } from '@/features/profile/api/profile-api'
import { Alert } from '@/shared/ui/Alert/Alert'

type ProfilePhotoUploaderProps = {
  onAvatarUploaded?: (avatarUrl: string | null) => void
  initialAvatar?: string
  userId: string
}

type ServerError = {
  data?: {
    message?: string
    errorsMessages?: string[]
  }
  status?: number
}

export default function ProfilePhotoUploader({ onAvatarUploaded, initialAvatar, userId }: ProfilePhotoUploaderProps) {
  const { preview, error, onSelectFile, accept, clear } = useImageUpload({
    maxSizeMB: 1,
    allowedTypes: ['image/jpeg'],
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation()
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation()
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(initialAvatar)
  const [showError, setShowError] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setCurrentAvatar(initialAvatar)
  }, [initialAvatar])

  const isValidFileType = (file: File): boolean => {
    return (
      file.type === 'image/jpeg' ||
      file.name.toLowerCase().endsWith('.jpeg') ||
      file.name.toLowerCase().endsWith('.jpg')
    )
  }

  const getErrorMessage = (error: unknown): string => {
    const serverError = error as ServerError

    if (serverError?.data?.message) {
      return serverError.data.message
    }

    if (serverError?.data?.errorsMessages?.length) {
      return serverError.data.errorsMessages.join(', ')
    }

    if (serverError?.status === 400) {
      return 'Invalid file. Please select a JPEG image under 1MB.'
    }

    if (serverError?.status === 401) {
      return 'Unauthorized'
    }

    return 'Failed to upload avatar. Please try again.'
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!isValidFileType(file)) {
        setShowError('Error! Only JPEG images are allowed.')
        setIsModalOpen(true)
        return
      }

      if (file.size > 1024 * 1024) {
        setShowError('Error! File size must not exceed 1MB.')
        setIsModalOpen(true)
        return
      }

      onSelectFile(e)

      uploadAvatar(file)
        .unwrap()
        .then((response) => {
          const avatar192 = response.find((img) => img.width === 192 && img.height === 192)
          const avatarData = avatar192 || response[0]

          if (!avatarData) {
            throw new Error('Error! No photo URL returned from server')
          }

          const avatarUrl = avatarData.url.trim()
          setCurrentAvatar(avatarUrl)
          clear()
          onAvatarUploaded?.(avatarUrl)

          setIsModalOpen(false)
          setShowError(null)

          setSuccessMessage(`Photo uploaded successfully`)
          setShowSuccessAlert(true)

          setTimeout(() => {
            setShowSuccessAlert(false)
          }, 3000)
        })
        .catch((err) => {
          const errorMessage = getErrorMessage(err)
          setShowError(errorMessage)
          setIsModalOpen(true)
        })
    }
  }

  const handleDeleteAvatar = () => {
    if (isDeleting) return

    deleteAvatar({ userId })
      .unwrap()
      .then(() => {
        setCurrentAvatar(undefined)
        clear()
        onAvatarUploaded?.(null)
        setIsDeleteModalOpen(false)

        setSuccessMessage('Photo deleted successfully')
        setShowSuccessAlert(true)

        setTimeout(() => {
          setShowSuccessAlert(false)
        }, 3000)
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err)
        setShowError(errorMessage)
        setIsModalOpen(true)
      })
  }

  const displayAvatar = preview || currentAvatar

  return (
    <div className={s.profilePhotoUploader}>
      <div className={s.avatarContainer}>
        {displayAvatar ? (
          <>
            <Image
              src={displayAvatar}
              alt="Profile"
              loading="eager"
              width={192}
              height={192}
              className={s.avatarImage}
            />
            {!(isDeleting || isUploading) && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className={s.deleteButton}
                aria-label="Remove profile photo"
              >
                <CloseOutlineIcon width={24} height={24} color="#fff" />
              </button>
            )}
          </>
        ) : (
          <div className={s.placeholder}>
            <ImageOutlineIcon width={30} height={30} />
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="tertiary"
        onClick={() => {
          setIsModalOpen(true)
          setShowError(null)
        }}
        className={s.selectButton}
        disabled={isUploading || isDeleting}
      >
        {isUploading ? 'Uploading...' : isDeleting ? 'Deleting...' : 'Select Profile Photo'}
      </Button>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add a Profile Photo"
        message={''}
        buttonText="Select from Computer"
        onAction={triggerFileInput}
        isActionDisabled={isUploading || isDeleting}
      >
        <div className={s.modalContainer}>
          {showError && (
            <div className={s.errorContainer}>
              <p className={s.errorText}>{showError}</p>
            </div>
          )}
          {displayAvatar ? (
            <div className={s.modalPreviewContainer}>
              <Image
                src={displayAvatar}
                alt="Preview"
                loading="eager"
                width={192}
                height={192}
                className={s.modalPreview}
              />
            </div>
          ) : (
            <div className={s.placeholder}>
              <ImageOutlineIcon width={30} height={30} />
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Photo"
        message="Are you sure you want to delete the photo?"
        confirmMode={true}
        buttonText="Yes"
        onAction={handleDeleteAvatar}
        cancelButtonText="No"
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className={s.fileInput}
        aria-label="Upload profile photo"
        disabled={isUploading || isDeleting}
      />

      {error && !showError && <div className={s.errorMessage}>{error}</div>}

      {showSuccessAlert && <Alert status="success" text={successMessage} position="bottom-left" />}
    </div>
  )
}
