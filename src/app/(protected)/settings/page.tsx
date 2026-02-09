'use client'

import { useMeQuery } from '@/features/auth/api/auth-api'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import { ProfileEditForm } from '@/features/profileEdit/ui/ProfileEditForm'
import s from './page.module.scss'

export default function SettingsRedirect() {
  const { data: me, isLoading: isMeLoading, isError: isMeError } = useMeQuery()
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfileQuery(me?.userId ?? '', {
    skip: !me?.userId,
  })

  if (isMeLoading || isProfileLoading) return <div className={s.container}>loading settings...</div>
  if (isMeError || isProfileError || !me) return <div className={s.container}>Ошибка загрузки профиля.</div>

  const initialData = {
    username: profile?.username ?? '',
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    dateOfBirth: profile?.dateOfBirth
      ? new Date(profile?.dateOfBirth).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '',
    country: profile?.country ?? '',
    city: profile?.city ?? '',
    aboutMe: profile?.aboutMe ?? '',
  }

  return (
    <>
      <ProfileEditForm initialData={initialData} />
    </>
  )
}
