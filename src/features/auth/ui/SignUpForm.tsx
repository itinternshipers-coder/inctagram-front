import { GithubIcon, GoogleIcon } from '@/shared/icons/svgComponents'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { CheckBox } from '@/shared/ui/CheckBox/CheckBox'
import { Input } from '@/shared/ui/Input/Input'
import { Typography } from '@/shared/ui/Typography/Typography'
import Link from 'next/link'

export const SignUpForm = () => {
  return (
    <form action="">
      <Card>
        <Typography variant="h1">Sign Up</Typography>

        <div>
          <Button href={''} as={Link} variant="link">
            <GoogleIcon height={'36px'} width={'36px'} />
          </Button>
          <Button href={''} as={Link} variant="link">
            <GithubIcon height={'36px'} width={'36px'} color="white" />
          </Button>
        </div>

        <Input label="Username" name="username" placeholder="userName" />
        <Input label="Email" name="email" type="email" placeholder="userName@gmail.com" />
        <Input label="Password" name="password" type="password" placeholder="*****************" />
        <Input label="Password confirmation" name="passwordConfirm" type="password" placeholder="*****************" />

        <div>
          <Typography variant="small_text">
            <CheckBox checked={true} />I agree to the
            <Typography variant="small_link">Terms of Service</Typography>
            and
            <Typography variant="small_link">Privacy Policy</Typography>
          </Typography>
        </div>

        <Button variant="primary" fullWidth={true}>
          Sign Up
        </Button>

        <Typography variant="regular_text_16">Do you have an account?</Typography>
        <Button href={''} as={Link} variant="link">
          Sign In
        </Button>
      </Card>
    </form>
  )
}
