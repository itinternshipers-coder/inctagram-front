import { z } from 'zod'

// Схема для валидации email
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .max(100, 'Email слишком длинный')
    .toLowerCase()
    .trim()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Введите корректный email адрес'),
})

// Тип для TypeScript
export type EmailFormData = z.infer<typeof emailSchema>
