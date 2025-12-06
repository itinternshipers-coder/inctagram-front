'use client'

import { useCreateNewPasswordMutation } from '@/features/auth/api/password-api'
import {
  PasswordRecoveryConfirmFormData,
  PasswordRecoveryConfirmSchema,
} from '@/features/auth/lib/schemas/password-recovery-confirm-schema'
import s from '@/features/auth/ui/CreateNewPassword/CreateNewPassword.module.scss'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { Input } from '@/shared/ui/Input/Input'
import { Typography } from '@/shared/ui/Typography/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

type Props = {
  recoveryCode?: string
}

export const CreateNewPassword = ({ recoveryCode }: Props) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordRecoveryConfirmFormData>({
    defaultValues: {
      recoveryCode: recoveryCode || '',
      newPassword: '',
      passwordConfirmation: '',
    },
    resolver: zodResolver(PasswordRecoveryConfirmSchema),
  })

  const [createNewPassword, { isLoading: isCreatingPassword }] = useCreateNewPasswordMutation()

  const isLoading = isCreatingPassword

  const onSubmit = async (data: PasswordRecoveryConfirmFormData) => {
    try {
      await createNewPassword({
        recoveryCode: data.recoveryCode,
        newPassword: data.newPassword,
      }).unwrap()

      router.push('/auth/login')
    } catch (error) {
      console.error('Password change failed:', error)
    }
  }

  return (
    <Card className={s.cardContainer}>
      <Typography as="h2" className={s.title} variant="h2">
        Create New Password
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={s.inputWrapper}>
          <Input
            label="New password"
            autoComplete="new-password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
            placeholder="********"
            type="password"
          />

          <Input
            label="Password confirmation"
            autoComplete="new-password"
            {...register('passwordConfirmation')}
            error={errors.passwordConfirmation?.message}
            placeholder="********"
            type="password"
          />
        </div>

        <Typography className={s.newPassWarning} variant="regular_text_14">
          Your password must be between 6 and 20 characters
        </Typography>

        <Button fullWidth disabled={isLoading} type="submit">
          {isLoading ? 'Processing...' : 'Create new password'}
        </Button>
      </form>
    </Card>
  )
}
