'use client'

import { AddPhoto } from '@/widgets/CreatPost/CreatePostModal/AddPhoto/AddPhoto'
import { Cropping } from '@/widgets/CreatPost/CreatePostModal/Cropping/Cropping'
import { Filters } from '@/widgets/CreatPost/CreatePostModal/Filters/Filters'
import { useModalSteps } from '@/widgets/CreatPost/CreatePostModal/hooks/useModalSteps'
import { Publication } from '@/widgets/CreatPost/CreatePostModal/Publication/Publication'
import React, { useState } from 'react'

export type ModalStep = 'add-photo' | 'cropping' | 'filters' | 'publication'

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
  const handleFilterApply = (images: File | File[]) => {
    if (!images) {
      setImages(images)
      return
    }

    if (Array.isArray(images)) {
      setImages(images)
    } else {
      setImages([images])
    }
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
