import { ErrorResponse } from '@/shared/api/types'

export type Avatar = {
  userId: string
  url: string
  width: number
  height: number
}

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
    avatar?: Avatar[]
  }
  error: ErrorResponse
}

export type AvatarMutation = {
  request: File
  response: Avatar[]
  error: ErrorResponse
}

export type DeleteAvatar = {
  request: void
  response: void
  error: ErrorResponse
}
