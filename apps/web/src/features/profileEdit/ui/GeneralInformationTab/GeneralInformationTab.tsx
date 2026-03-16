'use client'

import { parse, format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DatePicker, Button, Input, SelectBox, TextArea } from '@inctagram/ui'
import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, useWatch } from 'react-hook-form'
import ProfilePhotoUploader from '../ProfilePhotoUploader/ProfilePhotoUploader'
import { ProfileEditFormValues } from '../../lib/validation'
import { COUNTRIES } from '../../lib/data/countries'
import { CITIES_BY_COUNTRY } from '../../lib/data/cities'
import { useState } from 'react'
import s from './GeneralInformationTab.module.scss'

type GeneralInformationTabProps = {
  register: UseFormRegister<ProfileEditFormValues>
  control: Control<ProfileEditFormValues>
  errors: FieldErrors<ProfileEditFormValues>
  isValid: boolean
  isDirty: boolean
  setValue: UseFormSetValue<ProfileEditFormValues>
  initialAvatar?: string
  isSubmitting?: boolean
}

export function GeneralInformationTab({
  register,
  control,
  errors,
  isValid,
  isDirty,
  setValue,
  initialAvatar,
  isSubmitting,
}: GeneralInformationTabProps) {
  const selectedCountry = useWatch({
    control,
    name: 'country',
  })
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(initialAvatar)

  const handleAvatarUploaded = (avatarUrl: string | null) => {
    if (avatarUrl === null) {
      setValue('avatar', '', { shouldDirty: true, shouldValidate: true })
      setCurrentAvatar(undefined)
    } else {
      setValue('avatar', avatarUrl, { shouldDirty: true, shouldValidate: true })
      setCurrentAvatar(avatarUrl)
    }
  }

  return (
    <div className={s.container}>
      <ProfilePhotoUploader
        onAvatarUploaded={handleAvatarUploaded}
        initialAvatar={currentAvatar}
        userId={control._formValues.id}
      />
      <div className={s.formSection}>
        <Input label="Username*" placeholder="userName" {...register('username')} error={errors.username?.message} />
        <Input label="First Name*" required {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Last Name*" required {...register('lastName')} error={errors.lastName?.message} />
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange: formOnChange, value: formValue }, fieldState: { error } }) => {
            // Преобразуем строку из формы (dd.MM.yyyy) в Date для DatePicker
            let dateValue: Date | undefined
            if (typeof formValue === 'string' && formValue.trim() !== '') {
              const parsed = parse(formValue, 'dd.MM.yyyy', new Date())
              if (!isNaN(parsed.getTime())) {
                dateValue = parsed
              }
            }

            const handleDateChange = (date: Date | DateRange | undefined) => {
              // В режиме "single" всегда получаем только Date | undefined
              if (date instanceof Date) {
                formOnChange(format(date, 'dd.MM.yyyy'))
              } else {
                formOnChange('')
              }
            }

            return (
              <DatePicker
                mode="single"
                value={dateValue}
                onChange={handleDateChange}
                label="Date of Birth"
                placeholder="dd.MM.yyyy"
                format="dd.MM.yyyy"
                error={error?.message}
              />
            )
          }}
        />
        <div className={s.locationRow}>
          <Controller
            control={control}
            name="country"
            render={({ field: { value, onChange } }) => (
              <SelectBox
                options={COUNTRIES.map((county) => ({ label: county, value: county }))}
                label="Select your country"
                value={value || undefined}
                onValueChange={(val) => {
                  onChange(val)
                }}
                placeholder="Country"
              />
            )}
          />
          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => {
              const cities = selectedCountry ? CITIES_BY_COUNTRY[selectedCountry] || [] : []

              return (
                <SelectBox
                  options={cities.map((city) => ({ label: city, value: city }))}
                  label="Select your city"
                  value={value || undefined}
                  onValueChange={onChange}
                  placeholder="City"
                />
              )
            }}
          />
        </div>
        <TextArea
          label="About Me"
          {...register('aboutMe')}
          error={!!errors.aboutMe}
          errorMessage={errors.aboutMe?.message}
        />
        <hr className={s.divider} />
        <div className={s.actions}>
          <Button type="submit" variant="primary" disabled={!isDirty || !isValid || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
