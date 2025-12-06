'use client'

import { useResendRecoveryLinkMutation } from '@/features/auth/api/password-api'
import { normalizeError } from '@/shared/api/error-utils'
import type { ErrorResponse } from '@/shared/api/types'
import { Alert } from '@/shared/ui/Alert/Alert'
import { Button } from '@/shared/ui/Button/Button'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Typography } from '@/shared/ui/Typography/Typography'
import Image from 'next/image'

import { useState } from 'react'

import s from './ResendPasswordLinkRecovery.module.scss'

type Props = {
  email: string
  oldRecoveryCode: string
  resendError?: ErrorResponse | null
}

export const ResendPasswordLinkRecovery = ({ email, oldRecoveryCode, resendError }: Props) => {
  const [resendRecoveryLink, { isLoading }] = useResendRecoveryLinkMutation()
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState<ErrorResponse | null>(null)

  const verifiedExpired = '/images/illustrations/VerifiedExpired.svg'

  const handleResendLink = async () => {
    if (oldRecoveryCode) {
      try {
        await resendRecoveryLink({ oldRecoveryCode }).unwrap()
        setOpenModal(true)
        setError(null)
      } catch (error) {
        setError(normalizeError(error))
      }
    }
  }

  const errorMessage = resendError?.errorsMessages?.[0]?.message || error?.errorsMessages?.[0]?.message

  return (
    <div className={s.container}>
      {errorMessage && <Alert status="error" text={errorMessage} position={'bottom-left'} />}

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Email sent"
        message={`We have sent a link to confirm your email to ${email}`}
        buttonText="OK"
        isCancelPrimary={false}
      />

      <div className={s.header}>
        <Typography variant="h1" className={s.title}>
          Email verification link expired
        </Typography>
        <Typography variant="regular_text_16" className={s.description}>
          Looks like the verification link has expired. Not to worry, we can send the link again to <i>{email}</i>
        </Typography>
      </div>

      <div className={s.visualBlock}>
        <div className={s.btn}>
          <Button variant="primary" onClick={handleResendLink} disabled={isLoading} fullWidth>
            Resend verification link
          </Button>
        </div>

        <Image src={verifiedExpired} alt="Email verified" width={473} height={352} />
      </div>
    </div>
  )
}
