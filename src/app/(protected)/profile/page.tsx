'use client'

import { useMeQuery } from '@/features/auth/api/auth-api'
import { ROUTES } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export default function ProfileRedirect() {
  const { data: profile, isLoading, isError } = useMeQuery()

  if (isLoading) return 'Загружаем данные профиля'
  if (isError || !profile) return <div>Не удалось загрузить профиль.</div>

  redirect(ROUTES.DYNAMIC.PROFILE(profile.userName))
}
