'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { EyeOffOutlineIcon, EyeOutlineIcon, GithubIcon, GoogleIcon } from '@/shared/icons/svgComponents'
import { Card } from '@/shared/ui/Card/Card'
import { Typography } from '@/shared/ui/Typography/Typography'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { Alerts } from '@/shared/ui/Alerts/Alerts'
import s from './SignInForm.module.scss'

const signInSchema = z.object({
  email: z.string().email({ message: 'Неверный email' }),
  password: z.string().min(1, { message: 'Пароль обязателен' }),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInForm() {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignInFormData) => {}

  return (
    <Card className={s.form}>
      <Typography variant="h1" className={s.title}>
        Sign In
      </Typography>

      <div className={s.socialButtons}>
        <Button as="a" variant="link" href="/login" className="socialButton">
          <GoogleIcon width={36} height={36} />
        </Button>

        <Button as="a" variant="link" href="/login" className="socialButton">
          <GithubIcon width={36} height={36} style={{ color: 'var(--foreground)' }} />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={s.inputGroup}>
          <Input
            label="Email"
            {...register('email')}
            placeholder="Epam@epam.com"
            error={errors.email?.message?.toString()}
          />
        </div>

        <div className={s.inputGroup}>
          <Input
            label="Password"
            type="password"
            {...register('password')}
            placeholder="********"
            error={errors.password?.message?.toString()}
          />
        </div>

        <div className={s.forgotPassword}>
          <Typography variant="regular_text_14">
            <a href="/forgot-password">Forgot Password</a>
          </Typography>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Вход...' : 'Sign In'}
        </Button>

        {error && <Alerts status="error" text={error} position="bottom-left" />}

        <div className={s.signupLink}>
          <Typography>Don’t have an account?</Typography>
          <Typography variant="regular_text_16">
            <a href="/register">Sign Up</a>
          </Typography>
        </div>
      </form>
    </Card>
  )
}
