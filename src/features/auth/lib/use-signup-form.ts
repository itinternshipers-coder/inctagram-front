// src/features/auth/hooks/useSignUpForm.ts

import { useState } from 'react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignupMutation } from '../api/auth-api'
import { SignUpFormData, SignUpSchema } from '../lib/schemas/signup-schema'
import { ErrorResponse } from '@/shared/api/types'

export const useSignUpForm = () => {
  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [emailForModal, setEmailForModal] = useState('')
  const [signup, { isLoading }] = useSignupMutation()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onTouched',
    defaultValues: {
      agreeToTerms: false,
    },
  })

  const { field: agreementField } = useController({
    name: 'agreeToTerms',
    control: form.control,
    defaultValue: false,
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { agreeToTerms, passwordConfirmation, ...signUpData } = data
      await signup(signUpData).unwrap()

      setShowAgreementModal(true)
      setEmailForModal(signUpData.email)
      form.reset()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const responseData = error.data as ErrorResponse
        if (responseData.message === 'Username is already taken') {
          form.setError('username', { message: 'This username is already taken' })
        } else if (responseData.message === 'User with this email already exists') {
          form.setError('email', { message: 'This email is already taken' })
        } else if (responseData.errorsMessages && responseData.errorsMessages.length > 0) {
          responseData.errorsMessages.forEach((err) => {
            form.setError(err.field as keyof SignUpFormData, { message: err.message })
          })
        } else {
          form.setError('root', { message: responseData.message || 'Registration failed' })
        }
      } else {
        form.setError('root', { message: 'Network error' })
      }
    }
  }

  return {
    ...form,
    agreementField,
    showAgreementModal,
    setShowAgreementModal,
    emailForModal,
    isLoading,
    onSubmit,
  }
}
