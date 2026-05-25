import { MESSENGER_LIMITS } from '@/features/messenger/model/types'
import { z } from 'zod'

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Message must contain at least 1 character')
    .max(
      MESSENGER_LIMITS.CONTENT_MAX_LENGTH,
      `Message must be at most ${MESSENGER_LIMITS.CONTENT_MAX_LENGTH} characters`
    ),
})

export type MessageFormValues = z.infer<typeof messageSchema>
