import { AvatarMutation, Profile } from '@/features/profile/model/type'
import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<Profile['response'], Profile['request']>({
      query: (userId) => EndpointHelpers.profile.byId(userId),
      providesTags: ['Profile'],
    }),
    addProfile: build.mutation<Profile['response'], FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.PROFILE.BASE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfile: build.mutation<Profile['response'], FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.PROFILE.BASE,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
    setAvatar: build.mutation<AvatarMutation['response'], AvatarMutation['request']>({
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
