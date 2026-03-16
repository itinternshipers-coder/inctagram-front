import { z } from 'zod'
import { PasswordSchema } from 'src/features/auth/lib/schemas/field-schemas'

export const PasswordRecoveryConfirmSchema = z
  .object({
    recoveryCode: z.string().min(1, 'Recovery code is required'),
    newPassword: PasswordSchema,
    passwordConfirmation: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  })

export type PasswordRecoveryConfirmFormData = z.infer<typeof PasswordRecoveryConfirmSchema>
