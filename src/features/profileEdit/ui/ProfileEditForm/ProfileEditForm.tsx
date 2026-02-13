'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateProfileMutation } from '@/features/profile/api/profile-api'
import { ProfileEditFormValues, profileEditSchema } from '../../lib/validation'
import { GeneralInformationTab } from '../GeneralInformationTab/GeneralInformationTab'
import { DevicesTab } from '../DevicesTab/DevicesTab'
import { AccountManagementTab } from '../AccountManagementTab/AccountManagementTab'
import { MyPaymentsTab } from '../MyPaymentsTab/MyPaymentsTab'
import Tabs from '@/shared/ui/Tabs/Tabs'
import { Alert } from '@/shared/ui/Alert/Alert'
import { useState } from 'react'
import { useGetProfileQuery } from '@/features/profile/api/profile-api'

type ProfileEditFormProps = {
  initialData: ProfileEditFormValues
  userId: string
}

export function ProfileEditForm({ initialData, userId }: ProfileEditFormProps) {
  const [updateProfile] = useUpdateProfileMutation()
  const [alert, setAlert] = useState<{ show: boolean; text: string }>({
    show: false,
    text: '',
  })

  const { refetch } = useGetProfileQuery(userId)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: initialData,
    mode: 'onChange',
  })

  const onSubmit = async (data: ProfileEditFormValues) => {
    const { avatar, ...updateData } = data
    try {
      await updateProfile(updateData).unwrap()
      await refetch()
      setAlert({ show: true, text: 'Your settings are saved!' })
      reset(data)
      setTimeout(() => setAlert({ show: false, text: '' }), 5000)
    } catch (err) {
      setAlert({ show: true, text: 'Server is not available!' })
      setTimeout(() => setAlert({ show: false, text: '' }), 5000)
    }
  }

  const tabs = [
    {
      label: 'General information',
      content: (
        <GeneralInformationTab
          control={control}
          register={register}
          errors={errors}
          isValid={isValid}
          isDirty={isDirty}
          setValue={setValue}
          initialAvatar={initialData.avatar}
          isSubmitting={isSubmitting}
        />
      ),
    },
    {
      label: 'Devices',
      content: <DevicesTab />,
    },
    {
      label: 'Account Management',
      content: <AccountManagementTab />,
    },
    {
      label: 'My payments',
      content: <MyPaymentsTab />,
      disabled: false,
    },
  ]

  return (
    <form key={initialData.username} onSubmit={handleSubmit(onSubmit)}>
      {alert.show && (
        <Alert
          status={alert.text.includes('Server is not available!') ? 'error' : 'success'}
          position="bottom-left"
          text={alert.text}
        />
      )}
      <Tabs tabs={tabs} />
    </form>
  )
}
