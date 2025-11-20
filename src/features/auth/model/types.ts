import { AuthoriseError, ErrorResponse } from '@/shared/api/types'

// sign-in
export type Login = {
  request: {
    email: string
    password: string
  }
  response: {
    accessToken: string
  }
  error: ErrorResponse | AuthoriseError
}

// log-out
export type Logout = {
  request: void
  response: void
  error: AuthoriseError
}

// sign-up
export type SignUp = {
  request: {
    username: string
    email: string
    password: string
  }
  response: {
    message: string
    userId: string
  }
  error: ErrorResponse
}

// confirm-email
export type ConfirmEmail = {
  request: {
    confirmationCode: string
  }
  response: {
    message: string
  }
  error: ErrorResponse
}

// resend-confirmation
export type ResendConfirm = {
  request: {
    email: string
  }
  response: {
    message: string
  }
  error: AuthoriseError
}

// password-recovery
export type PasswordRecovery = {
  request: {
    email: string
    recaptchaToken: string
  }
  response: {
    message: string
  }
  error: ErrorResponse
}

// password-recovery-confirm
export type PasswordRecoveryConfirm = {
  request: {
    recoveryCode: string
    newPassword: string
  }
  response: {
    message: string
  }
  error: ErrorResponse
}

// refresh-token
export type RefreshToken = {
  request: void
  response: {
    accessToken: string
  }
  error: AuthoriseError
}

// me
export type Me = {
  request: void
  response: {
    userId: string
    userName: string
    email: string
  }
  error: AuthoriseError
}
