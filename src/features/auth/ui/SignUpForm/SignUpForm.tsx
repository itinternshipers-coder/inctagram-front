'use client'

import { GithubIcon, GoogleIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { CheckBox } from '@/shared/ui/CheckBox/CheckBox'
import { Input } from '@/shared/ui/Input/Input'
import { Typography } from '@/shared/ui/Typography/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { useController, useForm } from 'react-hook-form'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useState } from 'react'
import { ErrorResponse } from '@/shared/api/types'
import { useSignupMutation } from '../../api/auth-api'
import Link from 'next/link'
import s from './SignUpForm.module.scss'
import { SignUpFormData, SignUpSchema } from '../../lib/schemas/signup-schema'

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    setError,
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onChange',
    defaultValues: {
      agreeToTerms: false,
    },
  })

  const { field: agreementField } = useController({
    name: 'agreeToTerms',
    control,
    defaultValue: false,
  })

  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [emailForModal, setEmailForModal] = useState('')

  const [signup, { isLoading }] = useSignupMutation()

  if (isLoading) {
    return (
      <Card className={s.card}>
        <Typography variant="regular_text_16">...loading</Typography>
      </Card>
    )
  }

  const agreementValue = agreementField.value
  const handleAgreementChange = agreementField.onChange

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { agreeToTerms, passwordConfirmation, ...signUpData } = data
      await signup(signUpData).unwrap()

      setShowAgreementModal(true)
      setEmailForModal(signUpData.email)
      reset()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const responseData = error.data as ErrorResponse
        if (responseData.message === 'Username is already taken') {
          setError('username', { message: 'This username is already taken' })
        } else if (responseData.message === 'User with this email already exists') {
          setError('email', { message: 'This email is already taken' })
        } else if (responseData.errorsMessages && responseData.errorsMessages.length > 0) {
          responseData.errorsMessages.forEach((err) => {
            setError(err.field as keyof SignUpFormData, { message: err.message })
          })
        } else {
          setError('root', { message: responseData.message || 'Registration failed' })
        }
      } else {
        setError('root', { message: 'Network error' })
      }
    }
  }

  return (
    <>
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
            <Input
              label="Username"
              placeholder="userName"
              {...register('username')}
              error={errors.username?.message}
              wrapperClassName={s.inputWithErrorSpace}
            />
            <Input
              label="Email"
              type="email"
              placeholder="userName@gmail.com"
              {...register('email')}
              error={errors.email?.message}
              wrapperClassName={s.inputWithErrorSpace}
            />
            <Input
              label="Password"
              type="password"
              placeholder="*****************"
              {...register('password')}
              error={errors.password?.message}
              wrapperClassName={s.inputWithErrorSpace}
            />
            <Input
              label="Password confirmation"
              type="password"
              placeholder="*****************"
              {...register('passwordConfirmation')}
              error={errors.passwordConfirmation?.message}
              wrapperClassName={s.inputWithErrorSpace}
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
      <Modal
        open={showAgreementModal}
        onOpenChange={setShowAgreementModal}
        title="Email sent"
        message={`We have sent a link to confirm your email to ${emailForModal}`}
        buttonText="OK"
        isCancelPrimary={false}
      />
    </>
  )
}
