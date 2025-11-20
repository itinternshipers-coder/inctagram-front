import { z } from 'zod'
import { UserNameSchema, EmailSchema, PasswordSchema } from './field-schemas'

export const SignUpSchema = z
  .object({
    username: UserNameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    passwordConfirmation: z.string().min(1, 'Password confirmation is required'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  })

export type SignUpFormData = z.infer<typeof SignUpSchema>
