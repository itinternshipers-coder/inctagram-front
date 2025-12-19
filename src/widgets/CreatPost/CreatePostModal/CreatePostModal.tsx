'use client'
import { AddPhoto } from '@/widgets/CreatPost/CreatePostModal/AddPhoto/AddPhoto'
import { Cropping } from '@/widgets/CreatPost/CreatePostModal/Cropping/Cropping'
import { ModalHeader } from '@/widgets/CreatPost/CreatePostModal/ModalHeader'
import { useModalSteps } from '@/widgets/CreatPost/CreatePostModal/hooks/useModalSteps'
import React, { useState } from 'react'
import s from './CreatePostModal.module.scss'

export type ModalStep = 'add-photo' | 'cropping' | 'filters' | 'publication'

export const CreatePostModal = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(true)

  const { currentStep, goNext, goBack } = useModalSteps()

  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  // const [filteredImage, setFilteredImage] = useState<string>('')

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
  const handlePublish = () => {
    console.log('Publishing:', { selectedImage, croppedImage })
    // Здесь логика публикации
    handleCloseModal()
  }

  if (!isOpen) return null

  return (
    <div className={s.overlayModal} onClick={handleCloseModal}>
      <div className={s.containerModal} onClick={(e) => e.stopPropagation()}>
        <ModalHeader
          currentStep={currentStep}
          onBack={goBack}
          onNext={currentStep === 'publication' ? handlePublish : goNext}
          onClose={handleCloseModal}
        />
        <div className={s.contentModal}>
          {currentStep === 'add-photo' && <AddPhoto onSelectImage={handleImageSelect} />}
          {currentStep === 'cropping' && <Cropping image={selectedImage} onCropComplete={setCroppedImage} />}
          {/*{currentStep === 'filters' && <Filters image={croppedImage} onFilterApply={setFilteredImage} />}*/}
          {/*{currentStep === 'publication' && <Publication image={filteredImage} onBack={goBack} onPublish={handlePublish} />}*/}
        </div>
      </div>
    </div>
  )
}
