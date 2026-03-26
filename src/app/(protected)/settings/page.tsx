'use client'

import { useMeQuery } from '@/features/auth/api/auth-api'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import { useCaptureSubscriptionMutation } from '@/features/subscription/api/subscriptions-api'
import { ProfileEditForm } from '@/features/profileEdit/ui/ProfileEditForm/ProfileEditForm'
import { Modal } from '@/shared/ui/Modal/Modal'
import Loader from '@/shared/ui/Loader/Loader'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import s from './page.module.scss'

export default function SettingsRedirect() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data: me, isLoading: isMeLoading, isError: isMeError } = useMeQuery()
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfileQuery(me?.userId ?? '', {
    skip: !me?.userId,
  })

  const [captureSubscription] = useCaptureSubscriptionMutation()

  const [paymentModal, setPaymentModal] = useState<{
    open: boolean
    success: boolean
    message: string
  }>({ open: false, success: false, message: '' })

  useEffect(() => {
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId') || searchParams.get('token')

    if (success === null) return

    const handlePaymentCallback = async () => {
      if (success === 'true' && orderId) {
        try {
          await captureSubscription(orderId).unwrap()
          setPaymentModal({
            open: true,
            success: true,
            message: 'Payment was successful!',
          })
        } catch {
          setPaymentModal({
            open: true,
            success: false,
            message: 'Transaction failed, please try again',
          })
        }
      } else {
        setPaymentModal({
          open: true,
          success: false,
          message: 'Transaction failed, please try again',
        })
      }

      router.replace('/settings?part=account-management', { scroll: false })
    }

    handlePaymentCallback()
  }, [searchParams, captureSubscription, router])

  if (isMeLoading || isProfileLoading) return <Loader />
  if (isMeError || isProfileError || !me || !profile) return <div className={s.container}>Ошибка загрузки профиля.</div>

  const getAvatarUrl = (avatar: string | { url: string; width: number; height: number }[] | undefined): string => {
    if (!avatar) return ''
    if (typeof avatar === 'string') return avatar
    return avatar[0]?.url.trim() || ''
  }

  const initialData = {
    username: profile.username ?? '',
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    dateOfBirth: profile.dateOfBirth
      ? new Date(profile.dateOfBirth).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '',
    country: profile.country ?? '',
    city: profile.city ?? '',
    aboutMe: profile.aboutMe ?? '',
    avatar: getAvatarUrl(profile.avatar),
  }

  return (
    <div className={s.container}>
      <ProfileEditForm initialData={initialData} userId={profile.userId} />

      <Modal
        open={paymentModal.open}
        onOpenChange={(open) => setPaymentModal((prev) => ({ ...prev, open }))}
        title={paymentModal.success ? 'Success' : 'Error'}
        message={paymentModal.message}
        buttonText="OK"
        onAction={() => setPaymentModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  )
}
