import { profileApi } from '@/features/profile/api/profile-api'
import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'
import type {
  FollowMutationArg,
  FollowsListRequest,
  FollowsListResponse,
  SearchUsersRequest,
  SearchUsersResponse,
} from '../model/types'

export const followingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /users/search?username=&pageSize=&cursor=
    searchUsers: build.query<SearchUsersResponse, SearchUsersRequest>({
      query: (params) => ({
        url: API_ENDPOINTS.USERS.SEARCH,
        params,
      }),
      providesTags: ['Users'],
    }),

    // POST /users/{userId}/follow
    followUser: build.mutation<void, FollowMutationArg>({
      query: ({ userId }) => ({
        url: EndpointHelpers.users.follow(userId),
        method: 'POST',
      }),
      onQueryStarted: async ({ userId, currentUserId }, { dispatch, queryFulfilled }) => {
        const targetPatch = dispatch(
          profileApi.util.updateQueryData('getProfile', userId, (draft) => {
            draft.isFollowed = true
            draft.followersCount = (draft.followersCount ?? 0) + 1
          })
        )

        const ownPatch = currentUserId
          ? dispatch(
              profileApi.util.updateQueryData('getProfile', currentUserId, (draft) => {
                draft.followingCount = (draft.followingCount ?? 0) + 1
              })
            )
          : null

        try {
          await queryFulfilled
        } catch {
          targetPatch.undo()
          ownPatch?.undo()
        }
      },
      invalidatesTags: (_result, _error, { userId, currentUserId }) => {
        const tags: Array<{ type: 'Profile'; id: string } | 'Following'> = [
          { type: 'Profile', id: userId },
          'Following',
        ]
        if (currentUserId) tags.push({ type: 'Profile', id: currentUserId })
        return tags
      },
    }),

    // DELETE /users/{userId}/follow
    unfollowUser: build.mutation<void, FollowMutationArg>({
      query: ({ userId }) => ({
        url: EndpointHelpers.users.follow(userId),
        method: 'DELETE',
      }),
      onQueryStarted: async ({ userId, currentUserId }, { dispatch, queryFulfilled }) => {
        const targetPatch = dispatch(
          profileApi.util.updateQueryData('getProfile', userId, (draft) => {
            draft.isFollowed = false
            draft.followersCount = Math.max(0, (draft.followersCount ?? 0) - 1)
          })
        )

        const ownPatch = currentUserId
          ? dispatch(
              profileApi.util.updateQueryData('getProfile', currentUserId, (draft) => {
                draft.followingCount = Math.max(0, (draft.followingCount ?? 0) - 1)
              })
            )
          : null

        try {
          await queryFulfilled
        } catch {
          targetPatch.undo()
          ownPatch?.undo()
        }
      },
      invalidatesTags: (_result, _error, { userId, currentUserId }) => {
        const tags: Array<{ type: 'Profile'; id: string } | 'Following'> = [
          { type: 'Profile', id: userId },
          'Following',
        ]
        if (currentUserId) tags.push({ type: 'Profile', id: currentUserId })
        return tags
      },
    }),

    // GET /profile/{userId}/followers?page=&pageSize=
    getFollowers: build.query<FollowsListResponse, FollowsListRequest>({
      query: ({ userId, ...params }) => ({
        url: EndpointHelpers.profile.followers(userId),
        params,
      }),
      providesTags: (_result, _error, { userId }) => [{ type: 'Following', id: `FOLLOWERS_${userId}` }],
    }),

    // GET /profile/{userId}/following?page=&pageSize=
    getFollowing: build.query<FollowsListResponse, FollowsListRequest>({
      query: ({ userId, ...params }) => ({
        url: EndpointHelpers.profile.following(userId),
        params,
      }),
      providesTags: (_result, _error, { userId }) => [{ type: 'Following', id: `FOLLOWING_${userId}` }],
    }),
  }),
})

export const {
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useLazyGetFollowersQuery,
  useGetFollowingQuery,
  useLazyGetFollowingQuery,
} = followingApi
