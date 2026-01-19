'use client'

import { ROUTES } from '@/shared/config/routes'
import { GithubIcon, GoogleIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { CheckBox } from '@/shared/ui/CheckBox/CheckBox'
import { Input } from '@/shared/ui/Input/Input'
import { Typography } from '@/shared/ui/Typography/Typography'
import { Modal } from '@/shared/ui/Modal/Modal'
import Link from 'next/link'
import s from './SignUpForm.module.scss'
import { useSignUpForm } from '../../lib/use-signup-form'

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    agreementField,
    showAgreementModal,
    setShowAgreementModal,
    emailForModal,
    isLoading,
    onSubmit,
  } = useSignUpForm()

  if (isLoading) {
    return (
      <Card className={s.card}>
        <Typography variant="regular_text_16">...loading</Typography>
      </Card>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className={s.card}>
          <Typography variant="h3">Sign Up</Typography>

          <div className={s.socialSignUp}>
            <Button href="" as={Link} variant="link" disabled={isSubmitting}>
              <GoogleIcon height="36px" width="36px" />
            </Button>
            <Button href="" as={Link} variant="link" disabled={isSubmitting}>
              <GithubIcon height="36px" width="36px" className={s.githubIcon} />
            </Button>
          </div>

          <div className={s.registrationForm}>
            <Input
              label="Username"
              placeholder="userName"
              {...register('username')}
              error={errors.username?.message}
              wrapperClassName={s.inputWithErrorSpace}
            />
            <Input
              label="Email"
              type="email"
              placeholder="userName@gmail.com"
              {...register('email')}
              error={errors.email?.message}
              wrapperClassName={s.inputWithErrorSpace}
            />
            <Input
              label="Password"
              type="password"
              placeholder="*****************"
              {...register('password')}
              error={errors.password?.message}
              wrapperClassName={s.inputWithErrorSpace}
            />
            <Input
              label="Password confirmation"
              type="password"
              placeholder="*****************"
              {...register('passwordConfirmation')}
              error={errors.passwordConfirmation?.message}
              wrapperClassName={s.inputWithErrorSpace}
            />
          </div>

          <div className={s.agreementBlock}>
            <CheckBox checked={agreementField.value} onCheckedChange={agreementField.onChange} />
            <Typography variant="small_text" as="span" className={s.typography}>
              I agree to the{' '}
              <Typography variant="small_link" as={Link} href={ROUTES.PUBLIC.TERMS} className={s.link}>
                Terms of Service
              </Typography>{' '}
              and{' '}
              <Typography variant="small_link" as={Link} href={ROUTES.PUBLIC.PRIVACY} className={s.link}>
                Privacy Policy
              </Typography>
            </Typography>
          </div>

          <Button variant="primary" fullWidth type="submit" disabled={!isValid || isSubmitting}>
            Sign Up
          </Button>

          <Typography variant="regular_text_16">Do you have an account?</Typography>
          <div>
            <Button href={ROUTES.PUBLIC.SIGN_IN} as={Link} variant="link">
              Sign In
            </Button>
          </div>
        </Card>
      </form>

      <Modal
        open={showAgreementModal}
        onOpenChange={setShowAgreementModal}
        title="Email sent"
        message={`We have sent a link to confirm your email to ${emailForModal}`}
        buttonText="OK"
        isCancelPrimary={false}
      />
    </>
  )
}
