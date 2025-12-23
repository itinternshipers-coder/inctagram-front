'use client'
import { AddPhoto } from '@/widgets/CreatPost/CreatePostModal/AddPhoto/AddPhoto'
import { Cropping } from '@/widgets/CreatPost/CreatePostModal/Cropping/Cropping'
import { Filters } from '@/widgets/CreatPost/CreatePostModal/Filters/Filters'
import { useModalSteps } from '@/widgets/CreatPost/CreatePostModal/hooks/useModalSteps'
import React, { useState } from 'react'
import s from './CreatePostModal.module.scss'

export type ModalStep = 'add-photo' | 'cropping' | 'filters' | 'publication'

export const CreatePostModal = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const [filteredImage, setFilteredImage] = useState<File | null>(null)

  const { currentStep, goNext, goBack } = useModalSteps()

  // Обработчик выбора изображения
  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file)
    // Автоматически переходим к следующему шагу при успешной загрузке
    goNext()
  }

  // Обработчик закрытия модалки
  const handleCloseModal = () => {
    setIsOpen(false)
  }

  // Обработчик публикации
  // const handlePublish = () => {
  //   console.log('Publishing:', { selectedImage, croppedImage })
  //   // Здесь логика публикации
  //   handleCloseModal()
  // }

  // Обработчик обработанного изображения
  const handleCropComplete = (croppedFile: File) => {
    setCroppedImage(croppedFile)
  }

  if (!isOpen) return null

  return (
    <div className={s.overlayModal} onClick={handleCloseModal}>
      {currentStep === 'add-photo' || currentStep === 'cropping' ? (
        <div className={s.containerModalSquare} onClick={(e) => e.stopPropagation()}>
          {currentStep === 'add-photo' && (
            <AddPhoto onSelectImage={handleImageSelect} onCloseModal={handleCloseModal} />
          )}
          {currentStep === 'cropping' && (
            <Cropping
              image={selectedImage}
              onCropComplete={handleCropComplete}
              currentStep={currentStep}
              onNext={goNext}
              onBack={goBack}
            />
          )}
        </div>
      ) : (
        <div className={s.containerModalRectangular} onClick={(e) => e.stopPropagation()}>
          {currentStep === 'filters' && (
            <Filters
              image={croppedImage}
              onFilterApply={setFilteredImage}
              currentStep={currentStep}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {/*{currentStep === 'publication' && (*/}
          {/*  <Publication*/}
          {/*    image={filteredImage}*/}
          {/*    onBack={goBack}*/}
          {/*    onPublish={handlePublish}*/}
          {/*  />*/}
          {/*)}*/}
        </div>
      )}
    </div>
  )
}
