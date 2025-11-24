'use client'
import { useForgotPasswordMutation } from '@/features/auth/api/password-api'
import { PasswordRecoveryFormData, PasswordRecoverySchema } from '@/features/auth/lib/schemas/password-recovery-schema'
import s from '@/features/auth/ui/ForgotPasswordForm/ForgotPasswordForm.module.scss'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { Input } from '@/shared/ui/Input/Input'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Recaptcha, RecaptchaStatus } from '@/shared/ui/Recaptcha/Recaptcha'
import { Typography } from '@/shared/ui/Typography/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useController, useForm } from 'react-hook-form'

export const ForgotPasswordForm = () => {
  const [recaptchaStatus, setRecaptchaStatus] = useState<RecaptchaStatus>('idle')
  const [showModal, setShowModal] = useState(false)
  const [emailModal, setEmailModal] = useState('')

  const [forgotPassword] = useForgotPasswordMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted, isValid, isSubmitting },
    watch,
  } = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(PasswordRecoverySchema),
    defaultValues: {
      email: '',
      recaptchaToken: '',
    },
    mode: 'onChange',
  })

  const { field: recaptchaField } = useController({
    name: 'recaptchaToken',
    control,
    defaultValue: '',
    rules: { required: 'Please complete the reCAPTCHA' },
  })

  const handleRecaptchaStatusChange = useCallback(
    (status: RecaptchaStatus) => {
      setRecaptchaStatus(status)

      // Генерируем/очищаем токен сразу при изменении статуса
      if (status === 'success') {
        const mockToken = `recaptcha_token_${Date.now()}_${Math.random().toString(36).slice(2, 15)}`
        recaptchaField.onChange(mockToken)
      } else if (status === 'error' || status === 'expired') {
        recaptchaField.onChange('')
      }
    },
    [recaptchaField]
  )

  // Следим за значениями полей
  const emailValue = watch('email')
  const recaptchaTokenValue = watch('recaptchaToken')

  // Проверяем валидность формы
  const isFormReady = isValid && emailValue && recaptchaTokenValue
  const isButtonDisabled = !isFormReady || isSubmitting

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    try {
      // API запрос для восстановления пароля
      await forgotPassword({
        email: data.email,
        recaptchaToken: data.recaptchaToken,
      })

      setShowModal(true)
      setEmailModal(data.email)
      setRecaptchaStatus('idle')
    } catch (error) {
      console.error('Ошибка отправки:', error)
    }
  }

  const buttonText = isSubmitted ? 'Send Link Again' : 'Send Link'

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

            {isSubmitted && (
              <Typography variant={'regular_text_14'} className={s.textForSendEmail}>
                The link has been sent by email. If you don’t receive an email send link again
              </Typography>
            )}
          </div>

          <div className={s.button}>
            <Button variant="primary" fullWidth={true} type={'submit'} disabled={isButtonDisabled}>
              {isSubmitting ? 'Sending...' : buttonText}
            </Button>
            <Button href={'/login'} as={Link} variant="link">
              Back to Sign In
            </Button>
          </div>
          {/* ReCAPTCHA компонент - только со статусом */}
          {!isSubmitted && <Recaptcha initialStatus={recaptchaStatus} onStatusChange={handleRecaptchaStatusChange} />}
        </Card>
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
