import { z } from 'zod'
import { EmailSchema, RecaptchaSchema } from './field-schemas'

export const PasswordRecoverySchema = z.object({
  email: EmailSchema,
  recaptchaToken: RecaptchaSchema,
})

export type PasswordRecoveryFormData = z.infer<typeof PasswordRecoverySchema>
