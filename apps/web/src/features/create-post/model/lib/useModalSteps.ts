import { ModalSteps } from '@/features/create-post/model/types/modalSteps'
import { useState } from 'react'

export const useModalSteps = () => {
  const [currentStep, setCurrentStep] = useState<ModalSteps>('add-photo')

  const modalSteps = ['add-photo', 'cropping', 'filters', 'publication'] as const

  const goNext = () => {
    const currentIndex = modalSteps.indexOf(currentStep)
    if (currentIndex < modalSteps.length - 1) {
      setCurrentStep(modalSteps[currentIndex + 1])
    }
  }

  const goBack = () => {
    const currentIndex = modalSteps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(modalSteps[currentIndex - 1])
    }
  }
  return { currentStep, goNext, goBack }
}
