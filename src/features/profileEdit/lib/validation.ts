import { z } from 'zod'

export const profileEditSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[A-Za-zА-Яа-яЁё]+$/u, 'Only Latin and Cyrillic letters are allowed'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(/^[A-Za-zА-Яа-яЁё]+$/u, 'Only Latin and Cyrillic letters are allowed'),

  dateOfBirth: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Invalid date format. Use DD.MM.YYYY')
    .refine(
      (dateStr) => {
        const [day, month, year] = dateStr.split('.').map(Number)
        const userDate = new Date(year, month - 1, day)

        // Проверяем, что дата корректна (например, не 31.02)
        if (userDate.getDate() !== day || userDate.getMonth() !== month - 1 || userDate.getFullYear() !== year) {
          return false
        }

        const today = new Date()
        const minAgeDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
        const maxAgeDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())

        return userDate >= minAgeDate && userDate <= maxAgeDate
      },
      { message: 'You must be between 13 and 120 years old' }
    ),

  country: z.string().optional(),
  city: z.string(),
  aboutMe: z.string().max(200, 'About me cannot exceed 200 characters').optional(),
  avatar: z.instanceof(File).optional(),
})

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>
