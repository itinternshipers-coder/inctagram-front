import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { Input } from '@/shared/ui/Input/Input'
import { Recaptcha } from '@/shared/ui/Recaptcha/Recaptcha'
import { Typography } from '@/shared/ui/Typography/Typography'
import s from '@/features/auth/ui/ForgotPasswordForm/ForgotPasswordForm.module.scss'
import Link from 'next/link'

export const ForgotPasswordForm = () => {
  return (
    <div className={s.container}>
      <Card className={s.card}>
        <Typography variant={'h1'} className={s.typography}>
          Forgot Password
        </Typography>
        <div className={s.sendEmail}>
          <Input label="Email" name="Email" placeholder="Epam@epam.com" />
          <Typography variant={'regular_text_14'} className={s.textForSend}>
            Enter your email address and we will send you further instructions
          </Typography>
        </div>
        <div className={s.button}>
          <Button variant="primary" fullWidth={true} as={'button'}>
            Send Link
          </Button>
          <Button href={'/'} as={Link} variant="link">
            Back to Sign In
          </Button>
        </div>
        <Recaptcha />
      </Card>
    </div>
  )
}
