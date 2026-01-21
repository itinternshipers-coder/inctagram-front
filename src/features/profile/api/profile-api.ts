import { AvatarMutation, DeleteAvatar, Profile } from '@/features/profile/model/type'
import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<Profile['response'], Profile['request']>({
      query: (userId) => EndpointHelpers.profile.byId(userId),
      providesTags: ['Profile'],
    }),
    updateProfile: build.mutation<Profile['response'], Partial<Profile['response']>>({
      query: (data) => ({
        url: API_ENDPOINTS.PROFILE.BASE,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    uploadAvatar: build.mutation<AvatarMutation['response'], AvatarMutation['request']>({
      query: (file) => {
        const formData = new FormData()
        formData.append('avatar', file)
        return {
          url: API_ENDPOINTS.PROFILE.UPLOAD_AVATAR,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Profile'],
    }),
    deleteAvatar: build.mutation<DeleteAvatar['response'], DeleteAvatar['request']>({
      query: () => ({
        url: API_ENDPOINTS.PROFILE.DELETE_AVATAR,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const { useGetProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation, useDeleteAvatarMutation } =
  profileApi
