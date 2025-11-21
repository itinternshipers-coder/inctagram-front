'use client'

import { GithubIcon, GoogleIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { CheckBox } from '@/shared/ui/CheckBox/CheckBox'
import { Input } from '@/shared/ui/Input/Input'
import { Typography } from '@/shared/ui/Typography/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useController, useForm } from 'react-hook-form'
import s from './SignUpForm.module.scss'
import { SignUpFormData, signUpSchema } from './validation'

type SignUpErrorResponse = {
  message: string
  errorsMessages: {
    field: string
    message: string
  }[]
}

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    setError,
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      agreement: false,
    },
  })

  const { field: agreementField } = useController({
    name: 'agreement',
    control,
    defaultValue: false,
  })

  const agreementValue = agreementField.value
  const handleAgreementChange = agreementField.onChange

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { agreement, passwordConfirm, ...signUpData } = data

      const response = await fetch('https://gateway.traineegramm.ru/api/v1/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData),
      })

      const responseData: SignUpErrorResponse = await response.json()

      if (!response.ok) {
        if (responseData.message === 'Username is already taken') {
          setError('username', { message: 'This username is already taken' })
        } else if (responseData.message === 'User with this email already exists') {
          setError('email', { message: 'This email is already taken' })
        } else if (responseData.errorsMessages && responseData.errorsMessages.length > 0) {
          responseData.errorsMessages.forEach((error) => {
            setError(error.field as keyof SignUpFormData, { message: error.message })
          })
        } else {
          setError('root', { message: responseData.message || 'Registration failed' })
        }
        return
      }

      reset()
      // router.push('/verify-email')
    } catch (error) {
      setError('root', { message: 'Network error' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className={s.card}>
        <Typography variant="h3">Sign Up</Typography>

        <div className={s.socialSignUp}>
          <Button href={''} as={Link} variant="link" disabled={isSubmitting}>
            <GoogleIcon height={'36px'} width={'36px'} />
          </Button>
          <Button href={''} as={Link} variant="link" disabled={isSubmitting}>
            <GithubIcon height={'36px'} width={'36px'} className={s.githubIcon} />
          </Button>
        </div>

        <div className={s.registrationForm}>
          <Input label="Username" placeholder="userName" {...register('username')} error={errors.username?.message} />
          <Input
            label="Email"
            type="email"
            placeholder="userName@gmail.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="*****************"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            label="Password confirmation"
            type="password"
            placeholder="*****************"
            {...register('passwordConfirm')}
            error={errors.passwordConfirm?.message}
          />
        </div>

        <div className={s.agreementBlock}>
          <CheckBox checked={agreementValue} onCheckedChange={handleAgreementChange} />

          <Typography variant="small_text" as="span" className={s.typography}>
            I agree to the
            <Typography variant="small_link" as={Link} href={'/terms-of-service'} className={s.link}>
              Terms of Service
            </Typography>
            and
            <Typography variant="small_link" as={Link} href={'/privacy-policy'} className={s.link}>
              Privacy Policy
            </Typography>
          </Typography>
        </div>

        <Button variant="primary" fullWidth={true} type="submit" disabled={!isValid || isSubmitting}>
          Sign Up
        </Button>

        <Typography variant="regular_text_16">Do you have an account?</Typography>
        <div>
          <Button href={'/login'} as={Link} variant="link">
            Sign In
          </Button>
        </div>
      </Card>
    </form>
  )
}
