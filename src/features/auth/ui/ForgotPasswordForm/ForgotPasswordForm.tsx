'use client'
import s from '@/features/auth/ui/ForgotPasswordForm/ForgotPasswordForm.module.scss'
import { EmailFormData, emailSchema } from '@/features/auth/ui/ForgotPasswordForm/validation'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { Input } from '@/shared/ui/Input/Input'
import { Recaptcha, RecaptchaStatus } from '@/shared/ui/Recaptcha/Recaptcha'
import { Typography } from '@/shared/ui/Typography/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const ForgotPasswordForm = () => {
  const [status, setStatus] = useState<RecaptchaStatus>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isValid },
    watch,
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  })

  // Следим за значением email через watch вместо отдельного состояния
  const emailValue = watch('email')

  // Проверяем валидность email и reCAPTCHA
  const isEmailValid = emailValue.length > 0 && isValid // Используем валидность формы
  const inputChecked = isEmailValid && status === 'success'

  const onSubmit = async (data: EmailFormData) => {
    console.log('Email пользователя:', data)

    try {
      // Здесь должен быть API запрос для восстановления пароля
      // await forgotPasswordAPI(data.email)

      // Показываем успешное состояние
      // setIsSubmitted(true)
      // setIsModalOpen(true)

      // Опционально: сбрасываем форму если нужно
      reset()
    } catch (error) {
      // Обработка ошибок API
      console.error('Ошибка отправки:', error)
    }
  }

  const buttonText = isSubmitted ? 'Send Link Again' : 'Send Link'

  return (
    <>
      <div className={s.container}>
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
                <Typography variant={'regular_text_14'} className={s.textForSendedEmail}>
                  The link has been sent by email. If you don’t receive an email send link again
                </Typography>
              )}
            </div>
            <div className={s.button}>
              <Button variant="primary" fullWidth={true} as={'button'} type={'submit'} disabled={!inputChecked}>
                {buttonText}
              </Button>
              <Button href={'/'} as={Link} variant="link">
                Back to Sign In
              </Button>
            </div>
            {isSubmitted ? <></> : <Recaptcha onStatusChange={(status) => setStatus(status)} />}
          </Card>
        </form>
      </div>
      {/*{isModalOpen && (*/}
      {/*  <div className={s.modalOverlay}>*/}
      {/*    <Card className={s.modalCard}>*/}
      {/*      <div className={s.modalContent}>*/}
      {/*        <div className={s.modalTitle}>*/}
      {/*          <Typography variant={'h1'}>Email sent</Typography>*/}
      {/*          <Button variant={'tertiary'} className={s.buttonModal}>*/}
      {/*            {<CloseOutlineIcon width={24} height={24} />}*/}
      {/*          </Button>*/}
      {/*        </div>*/}

      {/*        <Typography variant={'regular_text_16'} className={s.modalMessage}>*/}
      {/*          We have sent a link to confirm your email to*/}
      {/*        </Typography>*/}

      {/*        <Button variant="primary">OK</Button>*/}
      {/*      </div>*/}
      {/*    </Card>*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  )
}
