import { z } from 'zod'
import { EmailSchema, PasswordSchema } from './field-schemas'

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export type LoginFormData = z.infer<typeof LoginSchema>
