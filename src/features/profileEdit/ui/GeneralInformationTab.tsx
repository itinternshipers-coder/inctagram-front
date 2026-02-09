'use client'

import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form'
import { Button } from '@/shared/ui/Button/Button'
import { DatePicker } from '@/shared/ui/DatePicker/DatePicker'
import { Input } from '@/shared/ui/Input/Input'
import { SelectBox } from '@/shared/ui/SelectBox/SelectBox'
import ProfilePhotoUploader from './ProfilePhotoUploader'
import TextArea from '@/shared/ui/TextArea/TextArea'
import s from './GeneralInformationTab.module.scss'
import { ProfileEditFormValues } from '../lib/validation'
import { COUNTRIES } from '../lib/data/countries'
import { CITIES_BY_COUNTRY } from '../lib/data/cities'
import { useState } from 'react'

type GeneralInformationTabProps = {
  register: UseFormRegister<ProfileEditFormValues>
  control: Control<ProfileEditFormValues>
  errors: FieldErrors<ProfileEditFormValues>
  isValid: boolean
  isDirty: boolean
}

export function GeneralInformationTab({ register, control, errors, isValid, isDirty }: GeneralInformationTabProps) {
  const initialCountry = control._formValues.country || control._defaultValues?.country
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(initialCountry)

  return (
    <div className={s.container}>
      <ProfilePhotoUploader />
      <div className={s.formSection}>
        <Input placeholder="userName" {...register('username')} error={errors.username?.message} />
        <Input label="First Name*" required {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Last Name*" required {...register('lastName')} error={errors.lastName?.message} />
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <DatePicker
              mode="single"
              value={value}
              onChange={onChange}
              label="Date of Birth"
              placeholder="dd.MM.yyyy"
              dateFormat="dd.MM.yyyy"
              error={error?.message}
            />
          )}
        />
        <div className={s.locationRow}>
          <Controller
            control={control}
            name="country"
            render={({ field: { value, onChange } }) => (
              <SelectBox
                options={COUNTRIES.map((county) => ({ label: county, value: county }))}
                value={value || undefined}
                onValueChange={(val) => {
                  onChange(val)
                  setSelectedCountry(val)
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
          <Button type="submit" variant="primary" disabled={!isDirty || !isValid}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
