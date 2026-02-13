'use client'

import { useMeQuery } from '@/features/auth/api/auth-api'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'
import { ProfileEditForm } from '@/features/profileEdit/ui/ProfileEditForm/ProfileEditForm'
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
    <>
      <ProfileEditForm initialData={initialData} userId={profile.userId} />
    </>
  )
}
