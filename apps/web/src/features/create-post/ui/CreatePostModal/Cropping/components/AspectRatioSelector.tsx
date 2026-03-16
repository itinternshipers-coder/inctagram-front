import { ASPECT_RATIO_OPTIONS } from '../lib/constants'
import { AspectRatio } from '../lib/types'
import s from '../Cropping.module.scss'

type AspectRatioSelectorProps = {
  selectedAspect: AspectRatio
  onChange: (ratio: AspectRatio) => void
}

export const AspectRatioSelector = ({ selectedAspect, onChange }: AspectRatioSelectorProps) => {
  return (
    <div className={s.aspectSection}>
      <div className={s.aspectTitle}>Aspect Ratio</div>
      <div className={s.aspectButtons}>
        {ASPECT_RATIO_OPTIONS.map((ratio) => (
          <button
            key={ratio.label}
            className={`${s.aspectButton} ${selectedAspect.value === ratio.value ? s.active : ''}`}
            onClick={() => {
              onChange(ratio)
            }}
          >
            {ratio.label}
          </button>
        ))}
      </div>
    </div>
  )
}
