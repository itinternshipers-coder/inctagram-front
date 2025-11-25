import { useState } from 'react'
// import { Photo } from "./types";
import { Photo } from '../types'
import s from './ImageGalery.module.scss'

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
    // Используем s.imageGalleryContainer
    <div className={s.imageGalleryContainer}>
      <img src={currentPhoto.url} alt="Post content" className={s.mainImage} />

      {photos.length > 1 && (
        <>
          <button onClick={goToPrev} className={`${s.navButton} ${s.prevButton}`}>
            {'<'}
          </button>
          <button onClick={goToNext} className={`${s.navButton} ${s.nextButton}`}>
            {'>'}
          </button>
        </>
      )}

      <div className={s.dotsIndicator}>
        {photos.map((_, index) => (
          <span
            key={index}
            // Используем логику для активного класса
            className={`${s.dot} ${index === currentIndex ? s.active : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  )
}
