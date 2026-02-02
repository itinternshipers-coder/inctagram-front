import { CROPPING_IMAGES_CONSTANTS } from './constants'
import s from './Cropping.module.scss'
import React, { ChangeEvent } from 'react'

type ZoomControlsProps = {
  zoomControls: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  onZoomChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const ZoomControls = ({ zoomControls, setZoom, onZoomChange }: ZoomControlsProps) => {
  const { ZOOM } = CROPPING_IMAGES_CONSTANTS

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + ZOOM.STEP, ZOOM.MAX))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - ZOOM.STEP, ZOOM.MIN))
  }

  return (
    <>
      <div className={s.zoomLabel}>Zoom: {zoomControls.toFixed(1)}x</div>
      <div className={s.zoomSliderWrapper}>
        <button className={s.zoomButton} onClick={handleZoomOut} disabled={zoomControls <= ZOOM.MIN}>
          −
        </button>
        <input
          type="range"
          min={ZOOM.MIN}
          max={ZOOM.MAX}
          step={ZOOM.STEP}
          value={zoomControls}
          onChange={onZoomChange}
          className={s.zoomSlider}
        />
        <button className={s.zoomButton} onClick={handleZoomIn} disabled={zoomControls >= ZOOM.MAX}>
          +
        </button>
      </div>
    </>
  )
}
