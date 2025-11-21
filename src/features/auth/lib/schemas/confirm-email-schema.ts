import { z } from 'zod'

export const ConfirmEmailSchema = z.object({
  confirmationCode: z.string().min(1, 'Confirmation code is required'),
})

export type ConfirmEmailFormData = z.infer<typeof ConfirmEmailSchema>
