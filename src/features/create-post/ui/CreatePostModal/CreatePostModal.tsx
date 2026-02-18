'use client'

import { useModalSteps } from '@/features/create-post/model/lib/useModalSteps'
import { ROUTES } from '@/shared/config/routes'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { AddPhoto } from './AddPhoto/AddPhoto'
import { Cropping } from './Cropping/Cropping'
import { Filters } from './Filters/Filters'
import { Publication } from './Publication/Publication'

export const CreatePostModal = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [images, setImages] = useState<File[]>([])

  const { currentStep, goNext, goBack } = useModalSteps()

  const router = useRouter()

  // Обработчик выбора изображения
  const handleImageSelect = (files: File | null) => {
    if (files) {
      setImages([files])
      goNext()
    }
  }

  // Обработчик закрытия модалки
  const handleCloseModal = () => {
    setIsOpen(false)
    router.push(ROUTES.PUBLIC.HOME)
  }

  // Обработчик обработанного изображения и применения фильтров
  const handleCropAndFilter = (images: File[]) => {
    setImages(images)
  }

  if (!isOpen) return null

  return (
    <>
      {currentStep === 'add-photo' || currentStep === 'cropping' ? (
        <>
          {currentStep === 'add-photo' && (
            <AddPhoto onSelectImage={handleImageSelect} onCloseModal={handleCloseModal} />
          )}
          {currentStep === 'cropping' && images.length > 0 && (
            <Cropping
              images={images} // Передаем массив
              onCropComplete={handleCropAndFilter}
              currentStep={currentStep}
              onNext={goNext}
              onBack={goBack}
            />
          )}
        </>
      ) : (
        <>
          {currentStep === 'filters' && (
            <Filters
              images={images}
              onFilterApply={handleCropAndFilter}
              currentStep={currentStep}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {currentStep === 'publication' && (
            <Publication images={images} onBack={goBack} currentStep={currentStep} onNext={handleCloseModal} />
          )}
        </>
      )}
    </>
  )
}
