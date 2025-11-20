import { z } from 'zod'

export const UserNameSchema = z
  .string()
  .min(1, 'Username is required')
  .min(6, 'Minimum number of characters 6')
  .max(30, 'Maximum number of characters 30')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, _ and -')

export const EmailSchema = z
  .string()
  .min(1, 'Email is required')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'The email must match the format example@example.com')

export const PasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Minimum number of characters 6')
  .max(20, 'Maximum number of characters 20')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/,
    'Password must contain a-z, A-Z, 0-9 and special characters'
  )

export const RecaptchaSchema = z.string().min(1, 'Please verify you are not a robot')
