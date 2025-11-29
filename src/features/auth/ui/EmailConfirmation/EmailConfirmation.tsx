'use client'

import { useResendConfirmMutation } from '@/features/auth/api/auth-api'
import type { ErrorResponse } from '@/shared/api/types'
import Image from 'next/image'
import { Alert } from '@/shared/ui/Alert/Alert'
import { Button } from '@/shared/ui/Button/Button'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Typography } from '@/shared/ui/Typography/Typography'

import { useRouter } from 'next/navigation'

import { useState } from 'react'

import styles from './EmailConfirmation.module.scss'

type EmailConfirmationProps = {
  isSuccess: boolean
  email: string | null
}

export const EmailConfirmation = ({ isSuccess, email }: EmailConfirmationProps) => {
  const router = useRouter()
  const [resendConfirm, { isLoading }] = useResendConfirmMutation()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const verifiedSuccess = '/images/illustrations/VerifiedSuccess.svg'
  const verifiedExpired = '/images/illustrations/VerifiedExpired.svg'

  const handleSignIn = () => {
    router.push('/signin')
  }

  const handleResend = async () => {
    if (email) {
      try {
        await resendConfirm({ email }).unwrap()
        setOpen(true)
        setError('')
      } catch (error) {
        const apiError = error as ErrorResponse
        if (apiError?.errorsMessages && apiError.errorsMessages.length > 0) {
          setError(apiError.errorsMessages[0].message)
        } else {
          setError('An error occurred while resending the email.')
        }
      }
    }
  }

  return (
    <div className={styles.container}>
      {error && <Alert status="error" text={error} position={'bottom-left'} />}

      <Modal
        open={open}
        onOpenChange={setOpen}
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

        <Image src={isSuccess ? verifiedSuccess : verifiedExpired} alt="Email verified" width={432} height={300} />
      </div>
    </div>
  )
}
