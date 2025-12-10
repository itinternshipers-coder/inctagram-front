'use client'

import { useResendConfirmMutation } from '@/features/auth/api/auth-api'
import { normalizeError } from '@/shared/api/error-utils'
import type { ErrorResponse } from '@/shared/api/types'
import { ROUTES } from '@/shared/config/routes'
import Image from 'next/image'
import { Alert } from '@/shared/ui/Alert/Alert'
import { Button } from '@/shared/ui/Button/Button'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Typography } from '@/shared/ui/Typography/Typography'

import { useRouter } from 'next/navigation'

import { useState } from 'react'

import styles from './EmailConfirmation.module.scss'

type Props = {
  isSuccess: boolean
  email: string | null
  confirmError?: ErrorResponse | null
}

export const EmailConfirmation = ({ isSuccess, email, confirmError }: Props) => {
  const router = useRouter()
  const [resendConfirm, { isLoading }] = useResendConfirmMutation()
  const [openModal, setOpenModal] = useState(false)
  const [resendError, setResendError] = useState<ErrorResponse | null>(null)

  const imageSrc = isSuccess ? '/images/illustrations/VerifiedSuccess.svg' : '/images/illustrations/VerifiedExpired.svg'
  const imageWidth = isSuccess ? 432 : 473
  const imageHeight = isSuccess ? 300 : 352

  const handleSignIn = () => {
    router.push(ROUTES.PUBLIC.SIGN_IN)
  }

  const handleResend = async () => {
    if (email) {
      try {
        await resendConfirm({ email }).unwrap()
        setOpenModal(true)
        setResendError(null)
      } catch (error) {
        setResendError(normalizeError(error))
      }
    }
  }

  const errorMessage = confirmError?.errorsMessages?.[0]?.message || resendError?.errorsMessages?.[0]?.message

  return (
    <div className={styles.container}>
      {errorMessage && <Alert status="error" text={errorMessage} position={'bottom-left'} />}

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Email sent"
        message={`We have sent a link to confirm your email to ${email}`}
        buttonText="OK"
        isCancelPrimary={false}
      />

      <div className={styles.header}>
        <Typography variant="h1" className={styles.title}>
          {isSuccess ? 'Congratulations!' : 'Email verification link expired'}
        </Typography>
        <Typography variant="regular_text_16" className={styles.description}>
          {isSuccess ? (
            'Your email has been confirmed'
          ) : (
            <>
              Looks like the verification link has expired. Not to worry, we can send the link again to <i>{email}</i>
            </>
          )}
        </Typography>
      </div>

      <div className={styles.visualBlock}>
        <div className={styles.btn}>
          <Button variant="primary" onClick={isSuccess ? handleSignIn : handleResend} disabled={isLoading} fullWidth>
            {isSuccess ? 'Sign In' : 'Resend verification link'}
          </Button>
        </div>

        <Image src={imageSrc} alt="Email verified" width={imageWidth} height={imageHeight} />
      </div>
    </div>
  )
}
