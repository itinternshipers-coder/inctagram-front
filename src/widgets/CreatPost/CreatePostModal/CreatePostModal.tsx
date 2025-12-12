'use client'
import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import { AddPhoto } from '@/widgets/CreatPost/CreatePostModal/AddPhoto/AddPhoto'
import React, { useState } from 'react'
import s from './CreatePostModal.module.scss'

// type CreatePostModalProps = {}

type ModalStep = 'add-photo' | 'cropping' | 'filters' | 'publication'

export const CreatePostModal = () => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('add-photo')
  // const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(true)

  // Берется из хука useImageUpload.ts

  // const [croppedImage, setCroppedImage] = useState<string>('')
  // const [filteredImage, setFilteredImage] = useState<string>('')

  // Навигация
  // const goNext = () => {
  //   // Логика перехода на следующий шаг
  //   if (currentStep === 'add-photo') setCurrentStep('cropping')
  //   else if (currentStep === 'cropping') setCurrentStep('filters')
  //   else if (currentStep === 'filters') setCurrentStep('publication')
  // }
  // const goBack = () => {
  //   // Логика возврата на предыдущий шаг
  //   if (currentStep === 'cropping') setCurrentStep('add-photo')
  //   else if (currentStep === 'filters') setCurrentStep('cropping')
  //   else if (currentStep === 'publication') setCurrentStep('filters')
  // }

  // Загрузку и Валидацию изображения берем из хука useImageUpload.ts
  // // Обработчик выбора изображения
  const handleImageSelect = (file: File | null) => {
    // setSelectedImage(file)
    // Автоматически переходим к следующему шагу при успешной загрузке
    setCurrentStep('cropping')
  }
  // Обработчик закрытия модалки

  const handleCloseModal = () => {
    setIsOpen(!isOpen)
  }

  const stepTitles: Record<ModalStep, string> = {
    'add-photo': 'Add Photo',
    cropping: 'Cropping',
    filters: 'Apply Filters',
    publication: 'Create Post',
  }

  if (!isOpen) return null

  return (
    <div className={s.overlay}>
      <div className={s.containerCard}>
        <div className={s.cardHeader}>
          <div className={s.title}>{stepTitles[currentStep]}</div>
          <div className={s.closeBtn} onClick={handleCloseModal}>
            <CloseOutlineIcon />
          </div>
        </div>
        <div className={s.contentCard}>
          {currentStep === 'add-photo' && <AddPhoto onSelectImage={handleImageSelect} />}
        </div>

        {/*{currentStep === 'cropping' && (*/}
        {/*  <Cropping image={selectedImage} onCropComplete={setCroppedImage} onBack={goBack} onNext={goNext} />*/}
        {/*)}*/}

        {/*{currentStep === 'filters' && (*/}
        {/*  <Filters image={croppedImage} onFilterApply={setFilteredImage} onBack={goBack} onNext={goNext} />*/}
        {/*)}*/}

        {/*{currentStep === 'publication' && (*/}
        {/*  <Publication image={filteredImage} onBack={goBack} onPublish={handlePublish} />*/}
        {/*)}*/}
      </div>
    </div>
  )
}
