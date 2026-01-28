import s from '@/features/create-post/ui/CreatePostModal/Filters/Filters.module.scss'
import { ExtendedPhotoType } from '@/features/create-post/ui/CreatePostModal/Filters/types'
import { ArrowIosBackOutlineIcon, ArrowIosForwardOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'

type SlideImageProps = {
  currentImage: ExtendedPhotoType
  processedImagesRef: React.RefObject<ExtendedPhotoType[]>
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
}

export const SlideViewerImage = ({ currentImage, processedImagesRef, setCurrentIndex }: SlideImageProps) => {
  const goToPrevImage = () => {
    if (processedImagesRef.current.length <= 1) return
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : processedImagesRef.current.length - 1))
  }

  const goToNextImage = () => {
    if (processedImagesRef.current.length <= 1) return
    setCurrentIndex((prev) => (prev < processedImagesRef.current.length - 1 ? prev + 1 : 0))
  }

  return (
    <>
      <Button
        onClick={goToPrevImage}
        className={`${s.navButton} ${s.prevButton}`}
        variant="link"
        disabled={currentImage.isProcessing}
      >
        <ArrowIosBackOutlineIcon width={48} height={48} />
      </Button>
      <Button
        onClick={goToNextImage}
        className={`${s.navButton} ${s.nextButton}`}
        variant="link"
        disabled={currentImage.isProcessing}
      >
        <ArrowIosForwardOutlineIcon width={48} height={48} />
      </Button>
    </>
  )
}
