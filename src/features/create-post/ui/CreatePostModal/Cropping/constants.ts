import { AspectRatio } from '@/features/create-post/ui/CreatePostModal/Cropping/types'

export const CROPPING_IMAGES_CONSTANTS = {
  ZOOM: {
    MIN: 1,
    MAX: 3,
    STEP: 0.1,
  },
  UI: {
    LIMITS: {
      MAX_IMAGES: 10,
    },
  },
} as const

export const ASPECT_RATIO_OPTIONS: AspectRatio[] = [
  { value: undefined, label: 'Original' },
  { value: 1, label: '1:1' },
  { value: 4 / 5, label: '4:5' },
  { value: 16 / 9, label: '16:9' },
] as const
