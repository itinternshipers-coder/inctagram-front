import { useState } from 'react'
import { Photo } from '../types'
import s from './ImageGalery.module.scss'
import { Button } from '../../Button/Button'
import { ArrowIosBackOutlineIcon, ArrowIosForwardOutlineIcon } from '@/shared/icons/svgComponents'

export const ImageGallery = ({ photos }: { photos: Photo[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (photos.length === 0) {
    return <div className={`${s.imageGalleryContainer} ${s.placeholder}`}>No Media</div>
  }

  const currentPhoto = photos[currentIndex]

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className={s.imageGalleryContainer}>
      <img src={currentPhoto.url} alt="Post content" className={s.mainImage} />

      {photos.length > 1 && (
        <>
          <Button onClick={goToPrev} className={`${s.navButton} ${s.prevButton}`} variant="link">
            <ArrowIosBackOutlineIcon width={48} height={48} />
          </Button>
          <Button onClick={goToNext} className={`${s.navButton} ${s.nextButton}`} variant="link">
            <ArrowIosForwardOutlineIcon width={48} height={48} />
          </Button>
        </>
      )}

      <div className={s.dotsIndicator}>
        {photos.map((_, index) => (
          <span
            key={index}
            className={`${s.dot} ${index === currentIndex ? s.active : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  )
}
