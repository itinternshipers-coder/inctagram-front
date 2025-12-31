// Рабочая версия
'use client'
import { AddPhoto } from '@/widgets/CreatPost/CreatePostModal/AddPhoto/AddPhoto'
import { Cropping } from '@/widgets/CreatPost/CreatePostModal/Cropping/Cropping'
import { Filters } from '@/widgets/CreatPost/CreatePostModal/Filters/Filters'
import { useModalSteps } from '@/widgets/CreatPost/CreatePostModal/hooks/useModalSteps'
import React, { useState } from 'react'
import s from './CreatePostModal.module.scss'

export type ModalStep = 'add-photo' | 'cropping' | 'filters' | 'publication'

export const CreatePostModal = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]) // Изменил на массив
  const [isOpen, setIsOpen] = useState(true)
  const [croppedImages, setCroppedImages] = useState<File[] | null>(null)
  const [filteredImages, setFilteredImages] = useState<File[] | null>(null)

  const { currentStep, goNext, goBack } = useModalSteps()
  // console.log(filteredImages)
  // Обработчик выбора изображения (может принимать несколько файлов)
  const handleImageSelect = (files: File | null) => {
    if (files) {
      setSelectedImages([files])
      goNext()
    }
  }

  // Обработчик закрытия модалки
  const handleCloseModal = () => {
    setIsOpen(false)
  }

  // Обработчик обработанного изображения (теперь принимает массив)
  const handleCropComplete = (croppedFiles: File[]) => {
    setCroppedImages(croppedFiles)
  }

  // Обработчик применения фильтров (может принимать массив или один файл)
  const handleFilterApply = (files: File | File[] | null) => {
    if (!files) {
      setFilteredImages(null)
      return
    }

    if (Array.isArray(files)) {
      setFilteredImages(files)
    } else {
      setFilteredImages([files])
    }
  }

  if (!isOpen) return null

  return (
    <div className={s.overlayModal} onClick={handleCloseModal}>
      {currentStep === 'add-photo' || currentStep === 'cropping' ? (
        <div className={s.containerModalSquare} onClick={(e) => e.stopPropagation()}>
          {currentStep === 'add-photo' && (
            <AddPhoto onSelectImage={handleImageSelect} onCloseModal={handleCloseModal} />
          )}
          {currentStep === 'cropping' && selectedImages.length > 0 && (
            <Cropping
              images={selectedImages} // Передаем массив
              onCropComplete={handleCropComplete}
              currentStep={currentStep}
              onNext={goNext}
              onBack={goBack}
            />
          )}
        </div>
      ) : (
        <div className={s.containerModalRectangular} onClick={(e) => e.stopPropagation()}>
          {currentStep === 'filters' && croppedImages && (
            <Filters
              images={croppedImages} // Нужно обновить Filters для работы с массивом
              onFilterApply={handleFilterApply}
              currentStep={currentStep}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {/*{currentStep === 'publication' && filteredImages && (*/}
          {/*  <Publication*/}
          {/*    images={filteredImages}*/}
          {/*    onBack={goBack}*/}
          {/*    onPublish={handlePublish}*/}
          {/*  />*/}
          {/*)}*/}
        </div>
      )}
    </div>
  )
}
