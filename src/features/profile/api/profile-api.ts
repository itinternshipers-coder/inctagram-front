import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'

type ProfileType = {
  userId: string
  username: string
  firstName: string
  lastName: string
  dateOfBirth: string
  country: string
  city: string
  aboutMe: string
}

type AvatarVersion = {
  userId: string
  url: string
  width: number
  height: number
}

type UserAvatars = AvatarVersion[]

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<ProfileType, string>({
      query: (userId) => EndpointHelpers.profile.byId(userId),
      providesTags: ['Profile'],
    }),
    addProfile: build.mutation<ProfileType, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.PROFILE.BASE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfile: build.mutation<ProfileType, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.PROFILE.BASE,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
    setAvatar: build.mutation<UserAvatars, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('avatar', file)
        return {
          url: API_ENDPOINTS.PROFILE.AVATAR,
          method: 'POST',
          body: formData,
        }
      },
    }),
  }),
})
