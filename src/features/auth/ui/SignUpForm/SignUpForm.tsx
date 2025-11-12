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
    console.log('Данные пользователя:', data)

    try {
      reset()
    } catch (error) {}
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
            <GithubIcon height={'36px'} width={'36px'} color="white" />
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
            <Typography variant="small_link" className={s.link}>
              Terms of Service
            </Typography>
            and
            <Typography variant="small_link" className={s.link}>
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
