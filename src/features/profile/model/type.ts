import { ErrorResponse } from '@/shared/api/types'

export type Profile = {
  request: string
  response: {
    userId: string
    username: string
    firstName: string
    lastName: string
    dateOfBirth: string
    country: string
    city: string
    aboutMe: string
  }
  error: ErrorResponse
}

export type AvatarMutation = {
  request: File
  response: {
    userId: string
    url: string
    width: number
    height: number
  }[]
  error: ErrorResponse
}

export type DeleteAvatar = {
  request: void
  response: void
  error: ErrorResponse
}
