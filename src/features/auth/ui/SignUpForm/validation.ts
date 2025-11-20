import { z } from 'zod'

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[a-zA-Z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: 'Minimum number of characters 6' })
      .max(30, { message: 'Maximum number of characters 30' })
      .regex(/^[A-Za-z0-9_-]*$/, {
        message: 'Username can only contain letters, numbers, underscores, and hyphens',
      }),
    email: z.email({ message: 'The email must match the format example@example.com' }),
    password: z
      .string()
      .min(6, { message: 'Minimum number of characters 6' })
      .max(20, { message: 'Maximum number of characters 20' })
      .regex(passwordPattern, {
        message: `Password must contain 0-9, a-z, A-Z, ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~`,
      }),
    passwordConfirm: z.string(),
    agreement: z.boolean().refine((value) => value, {}),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm'],
  })

export type SignUpFormData = z.infer<typeof signUpSchema>
