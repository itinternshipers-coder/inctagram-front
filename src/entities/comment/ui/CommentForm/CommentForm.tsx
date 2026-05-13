'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui/Button/Button'
import { Input } from '@/shared/ui/Input/Input'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import s from './CommentForm.module.scss'

const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment must contain at least 1 character')
    .max(300, 'Comment must be at most 300 characters'),
})

type CommentFormValues = z.infer<typeof commentSchema>

type CommentFormProps = {
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
  submitLabel?: string
  onSubmit: (content: string) => Promise<void> | void
  onCancel?: () => void
  autoFocus?: boolean
  className?: string
}

export const CommentForm = ({
  defaultValue = '',
  disabled = false,
  placeholder = 'Add a Comment...',
  submitLabel = 'Publish',
  onSubmit,
  onCancel,
  autoFocus = false,
  className,
}: CommentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: defaultValue,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    reset({ content: defaultValue })
  }, [defaultValue, reset])

  useEffect(() => {
    if (autoFocus) {
      setFocus('content')
    }
  }, [autoFocus, setFocus])

  const submitHandler = handleSubmit(async ({ content }) => {
    await onSubmit(content.trim())
    reset({ content: '' })
    onCancel?.()
  })

  return (
    <form className={`${s.form} ${className ?? ''}`.trim()} onSubmit={submitHandler}>
      <Input
        placeholder={placeholder}
        error={errors.content?.message}
        maxLength={300}
        disabled={disabled || isSubmitting}
        wrapperClassName={s.inputWrapper}
        {...register('content')}
      />
      <Button type="submit" className={s.submitButton} disabled={disabled || isSubmitting || !isValid}>
        {submitLabel}
      </Button>
    </form>
  )
}
