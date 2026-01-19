import { ModalSteps } from '@/features/create-post/model/types/modalSteps'
import { ArrowIosBackOutlineIcon, CloseOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { Typography } from '@/shared/ui/Typography/Typography'
import s from '@/features/create-post/ui/CreatePostModal/ModalHeader/ModalHeader.module.scss'

export const ModalHeader = ({
  currentStep,
  onBack,
  onNext,
  onClose,
  disabled,
  onSubmitting,
}: {
  currentStep: ModalSteps
  onBack?: () => void
  onNext?: () => void
  onClose?: () => void
  disabled?: boolean
  onSubmitting?: boolean
}) => {
  const stepTitles: Record<ModalSteps, string> = {
    'add-photo': 'Add Photo',
    cropping: 'Cropping',
    filters: 'Filters',
    publication: 'Publication',
  }

  return (
    <div className={s.headerModal}>
      {currentStep === 'add-photo' ? (
        <>
          <Typography variant={'h1'}>{stepTitles[currentStep]}</Typography>
          <div className={s.closeBtn} onClick={onClose}>
            <CloseOutlineIcon />
          </div>
        </>
      ) : (
        <>
          <ArrowIosBackOutlineIcon onClick={onBack} className={s.buttonBack} />
          <Typography variant={'h1'}>{stepTitles[currentStep]}</Typography>
          <Button variant={'link'} onClick={onNext} disabled={disabled}>
            {currentStep === 'publication' ? (onSubmitting ? '...Publication' : 'Publish') : 'Next'}
          </Button>
        </>
      )}
    </div>
  )
}
