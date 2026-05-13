import { profileApi } from '@/features/profile/api/profile-api'
import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type {
  FollowMutationArg,
  FollowsListRequest,
  FollowsListResponse,
  SearchUsersRequest,
  SearchUsersResponse,
} from '../model/types'

type RawSearchUser = {
  id?: string
  userId?: string
  username?: string
  avatarUrl?: string | null
  avatars?: Array<{ url?: string | null }>
  profileLink?: string
}

type RawSearchUsersResponse =
  | number
  | string
  | SearchUsersResponse
  | {
      items?: RawSearchUser[]
      nextCursor?: string | null
      hasMore?: boolean
      cursor?: string | null
    }
  | RawSearchUser[]
  | null
  | undefined

type RawSearchUsersObject = {
  items?: RawSearchUser[]
  nextCursor?: string | null
  hasMore?: boolean
  cursor?: string | null
  data?: {
    items?: RawSearchUser[]
    nextCursor?: string | null
    hasMore?: boolean
    cursor?: string | null
  }
}

const normalizeSearchResponse = (response: RawSearchUsersResponse): SearchUsersResponse => {
  const objectResponse =
    response && !Array.isArray(response) && typeof response === 'object' ? (response as RawSearchUsersObject) : null
  const nestedData = objectResponse?.data ?? null
  const items = Array.isArray(response) ? response : (objectResponse?.items ?? nestedData?.items ?? [])
  const nextCursor =
    objectResponse?.nextCursor ?? nestedData?.nextCursor ?? objectResponse?.cursor ?? nestedData?.cursor ?? null
  const hasMore = objectResponse?.hasMore ?? nestedData?.hasMore ?? nextCursor !== null

  return {
    items: items
      .map((item) => {
        const id = item.id ?? item.userId
        const username = item.username

        if (!id || !username) {
          return null
        }

        return {
          id,
          username,
          avatarUrl: item.avatarUrl ?? item.avatars?.[0]?.url ?? null,
          profileLink: item.profileLink ?? EndpointHelpers.profile.byId(id),
        }
      })
      .filter((item): item is SearchUsersResponse['items'][number] => item !== null),
    nextCursor: Array.isArray(response) ? null : nextCursor,
    hasMore: Array.isArray(response) ? false : hasMore,
  }
}

export const followingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /users/search?username=&pageSize=&cursor=
    searchUsers: build.query<SearchUsersResponse, SearchUsersRequest>({
      async queryFn({ username, ...params }, _api, _extraOptions, baseQuery) {
        const response = await baseQuery({
          url: API_ENDPOINTS.USERS.SEARCH,
          params: {
            ...params,
            username,
          },
        })

        if (response.error) {
          return { error: response.error as FetchBaseQueryError }
        }

        const raw = response.data as RawSearchUsersResponse

        if (typeof raw === 'number' || (typeof raw === 'string' && /^\d+$/.test(raw.trim()))) {
          const userId = String(raw).trim()
          const profileResponse = await baseQuery(EndpointHelpers.profile.byId(userId))

          if (profileResponse.error) {
            return {
              data: {
                items: [],
                nextCursor: null,
                hasMore: false,
              },
            }
          }

          const profile = profileResponse.data as {
            userId: string
            username?: string
            avatar?: Array<{ url?: string | null }>
          }

          const resolvedUsername = profile.username

          return {
            data: resolvedUsername
              ? {
                  items: [
                    {
                      id: profile.userId,
                      username: resolvedUsername,
                      avatarUrl: profile.avatar?.[0]?.url ?? null,
                      profileLink: EndpointHelpers.profile.byId(profile.userId),
                    },
                  ],
                  nextCursor: null,
                  hasMore: false,
                }
              : {
                  items: [],
                  nextCursor: null,
                  hasMore: false,
                },
          }
        }

        return { data: normalizeSearchResponse(raw) }
      },
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
            draft.followersCount = draft.followersCount ?? 0
          })
        )

        const ownPatch = currentUserId
          ? dispatch(
              profileApi.util.updateQueryData('getProfile', currentUserId, (draft) => {
                draft.followingCount = draft.followingCount ?? 0
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
