'use client'

import { CreateNewPassword } from '@/features/auth/ui/CreateNewPassword/CreateNewPassword'
import { ResendPasswordLinkRecovery } from '@/features/auth/ui/ResendPasswordLinkRecovery/ResendPasswordLinkRecovery'
import { ErrorResponse } from '@/shared/api/types'

type Props = {
  recoveryCode: string
  email: string
  data?: { message: string }
  error?: ErrorResponse | null
}

export const PasswordRecovery = ({ recoveryCode, email, data, error }: Props) => {
  // Если код валидный - показываем форму смены пароля
  if (data) {
    return <CreateNewPassword recoveryCode={recoveryCode} />
  }

  // Если есть ошибка - показываем компонент повторной отправки
  if (error) {
    return <ResendPasswordLinkRecovery oldRecoveryCode={recoveryCode} email={email} resendError={error} />
  }

  return null
}
