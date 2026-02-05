'use client'

import { useForgotPasswordMutation } from '@/features/auth/api/password-api'
import { PasswordRecoveryFormData, PasswordRecoverySchema } from '@/features/auth/lib/schemas/password-recovery-schema'
import { ErrorsMessage } from '@/shared/api/types'
import { ROUTES } from '@/shared/config/routes'
import { Alert } from '@/shared/ui/Alert/Alert'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { Input } from '@/shared/ui/Input/Input'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Typography } from '@/shared/ui/Typography/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Recaptcha } from '@/shared/ui/Recaptcha/Recaptcha'

import s from '@/features/auth/ui/ForgotPasswordForm/ForgotPasswordForm.module.scss'

export const ForgotPasswordForm = () => {
  const [showModal, setShowModal] = useState(false)
  const [emailModal, setEmailModal] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [requestSuccess, setRequestSuccess] = useState(false)

  const [forgotPassword] = useForgotPasswordMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(PasswordRecoverySchema),
    defaultValues: {
      email: '',
      recaptchaToken: '',
    },
    mode: 'onChange',
  })

  const emailValue = watch('email')
  const recaptchaValue = watch('recaptchaToken')
  const isEmailValid = !!emailValue && !errors.email
  const isFormReady = isEmailValid && !!recaptchaValue
  const isButtonDisabled = !isFormReady || isSubmitting

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    if (!data.recaptchaToken) {
      setErrorMessage('Please complete the reCAPTCHA')
      return
    }

    setErrorMessage('')
    try {
      await forgotPassword({
        email: data.email,
        recaptchaToken: data.recaptchaToken,
      }).unwrap()

      setShowModal(true)
      setRequestSuccess(true)
      setEmailModal(data.email)
      setValue('recaptchaToken', '')
    } catch (err) {
      const error = err as FetchBaseQueryError | SerializedError
      setRequestSuccess(false)

      if ('status' in error) {
        const data = error.data as {
          message?: string
          errorsMessages?: ErrorsMessage[]
        }
        if (data?.message) {
          setErrorMessage(data.message)
        } else if (error.status === 400) {
          setErrorMessage('Неверный формат email или ошибка reCAPTCHA')
        } else if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') {
          setErrorMessage('Ошибка соединения с сервером. Проверьте интернет')
        } else if (error.status === 'PARSING_ERROR') {
          setErrorMessage('Ошибка обработки ответа сервера')
        } else if (error.status === 500) {
          setErrorMessage('Внутренняя ошибка сервера. Мы уже работаем над этим')
        }
      } else if ('message' in error) {
        setErrorMessage(error.message || 'Произошла ошибка')
      } else {
        setErrorMessage('Неизвестная ошибка')
      }
    }
  }

  const buttonText = !requestSuccess ? 'Send Link' : 'Send Link Again'

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card as={'div'} className={s.card}>
          <Typography variant={'h1'} className={s.typography}>
            Forgot Password
          </Typography>

          <div className={s.sendEmail}>
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="Epam@epam.com"
            />
            <Typography variant={'regular_text_14'} className={s.textForSend}>
              Enter your email address and we will send you further instructions
            </Typography>

            {requestSuccess && (
              <Typography variant={'regular_text_14'} className={s.textForSendEmail}>
                The link has been sent by email. If you don’t receive an email, send the link again.
              </Typography>
            )}
          </div>

          <div className={s.button}>
            <Button variant="primary" fullWidth type="submit" disabled={isButtonDisabled}>
              {isSubmitting ? 'Sending...' : buttonText}
            </Button>
            <Button href={ROUTES.PUBLIC.SIGN_IN} as={Link} variant="link">
              Back to Sign In
            </Button>
          </div>
          <div className={s.recaptchaWrapper}>
            <Recaptcha
              onChange={(token) => setValue('recaptchaToken', token ?? '', { shouldValidate: true })}
              onExpired={() => setValue('recaptchaToken', '', { shouldValidate: true })}
            />
            {errors.recaptchaToken && (
              <Typography variant="regular_text_14" className={s.recaptchaError}>
                {errors.recaptchaToken.message}
              </Typography>
            )}
          </div>
        </Card>

        {errorMessage && <Alert status="error" text={errorMessage} position="bottom-left" />}
      </form>

      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title="Email sent"
        message={`We have sent a link to confirm your email to ${emailModal}`}
        buttonText="OK"
      />
    </>
  )
}
