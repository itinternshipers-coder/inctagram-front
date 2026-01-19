'use client'

import { useModalSteps } from '@/features/create-post/model/lib/useModalSteps'
import React, { useState } from 'react'
import { AddPhoto } from './AddPhoto/AddPhoto'
import { Cropping } from './Cropping/Cropping'
import { Filters } from './Filters/Filters'
import { Publication } from './Publication/Publication'

export const CreatePostModal = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [images, setImages] = useState<File[]>([])

  const { currentStep, goNext, goBack } = useModalSteps()

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
  }

  // Обработчик обработанного изображения (теперь принимает массив)
  const handleCropComplete = (images: File[]) => {
    setImages(images)
  }

  // Обработчик применения фильтров (может принимать массив или один файл)
  const handleFilterApply = (images: File[]) => {
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
              onCropComplete={handleCropComplete}
              currentStep={currentStep}
              onNext={goNext}
              onBack={goBack}
            />
          )}
        </>
      ) : (
        <>
          {currentStep === 'filters' && images && (
            <Filters
              images={images}
              onFilterApply={handleFilterApply}
              currentStep={currentStep}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {currentStep === 'publication' && images && (
            <Publication images={images} onBack={goBack} currentStep={currentStep} onNext={handleCloseModal} />
          )}
        </>
      )}
    </>
  )
}
