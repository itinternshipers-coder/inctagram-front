import { z } from 'zod'
import { EmailSchema, RecaptchaSchema } from 'src/features/auth/lib/schemas/field-schemas'

export const PasswordRecoverySchema = z.object({
  email: EmailSchema,
  recaptchaToken: RecaptchaSchema,
})

export type PasswordRecoveryFormData = z.infer<typeof PasswordRecoverySchema>
