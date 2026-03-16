import { clsx } from 'clsx'
import { ExtendedPhotoType } from '../lib/types'
import s from '../Filters.module.scss'

export const FILTERS = [
  { id: 'none', name: 'Original', className: s.filterNone },
  { id: 'grayscale', name: 'Grayscale', className: s.filterGrayscale },
  { id: 'sepia', name: 'Sepia', className: s.filterSepia },
  { id: 'vintage', name: 'Vintage', className: s.filterVintage },
  { id: 'colder', name: 'Colder', className: s.filterColder },
  { id: 'warmer', name: 'Warmer', className: s.filterWarmer },
]
type FiltersToImageProps = {
  currentImage: ExtendedPhotoType
  isApplyingAll: boolean
  onFilterToImage: (filterId: string) => void
}

export const FiltersToImage = ({ currentImage, isApplyingAll, onFilterToImage }: FiltersToImageProps) => {
  return (
    <>
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          className={clsx(s.filterButton, currentImage?.selectedFilter === filter.id && s.active)}
          onClick={() => onFilterToImage(filter.id)}
          disabled={currentImage?.isProcessing || isApplyingAll}
        >
          <div className={`${s.filterPreview} ${filter.className}`}>
            <div className={s.filterThumbnail} />
          </div>
          <span className={s.filterName}>{filter.name}</span>
        </button>
      ))}
    </>
  )
}
