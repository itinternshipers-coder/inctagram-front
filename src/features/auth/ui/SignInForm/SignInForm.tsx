'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GithubIcon, GoogleIcon } from '@/shared/icons/svgComponents'
import { Card } from '@/shared/ui/Card/Card'
import { Typography } from '@/shared/ui/Typography/Typography'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { Alerts } from '@/shared/ui/Alerts/Alerts'
import s from './SignInForm.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useAuth } from '@/features/auth/lib/use-auth'
import { LoginFormData, LoginSchema } from '@/features/auth/lib/schemas/login-schema'

export default function SignInForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  type ApiErrorField = {
    message: string
    field: string
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      await login(data)
      router.push('/profile')
    } catch (err) {
      const error = err as FetchBaseQueryError | SerializedError

      if ('status' in error) {
        // FetchBaseQueryError - проверяем наличие data.message
        const data = error.data as { message?: string; errorsMessages?: ApiErrorField[] }

        if (data?.message) {
          // Используем сообщение от сервера
          setErrorMessage(data.message)
        } else if (error.status === 401) {
          setErrorMessage('Неверный email или пароль')
        } else if (error.status === 400) {
          setErrorMessage('Ошибка валидации данных')
        } else if (error.status === 'FETCH_ERROR') {
          setErrorMessage('Ошибка соединения с сервером')
        } else {
          setErrorMessage('Произошла ошибка при входе')
        }
      } else if ('message' in error) {
        setErrorMessage(error.message || 'Произошла ошибка')
      } else {
        setErrorMessage('Неизвестная ошибка')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={s.form}>
      <Typography variant="h1" className={s.title} title="Sign In"></Typography>

      <div className={s.socialButtons}>
        <Button as={Link} variant="link" href="/login" className="socialButton">
          <GoogleIcon width={36} height={36} />
        </Button>

        <Button as={Link} variant="link" href="/login" className="socialButton">
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

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Sign In'}
        </Button>

        {errorMessage && <Alerts status="error" text={errorMessage} position="bottom-left" />}

        <div className={s.signupLink}>
          <Typography title={`Don't have an account?`}></Typography>
          <Typography variant="regular_text_16">
            <a href="/register">Sign Up</a>
          </Typography>
        </div>
      </form>
    </Card>
  )
}
