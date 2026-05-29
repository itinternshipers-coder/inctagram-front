import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'
import type { RootState } from '@/store/store'
import type {
  GetPosts,
  GetPostById,
  CreatePost,
  UpdatePost,
  DeletePost,
  GetUserPosts,
  GetFeed,
  LikePost,
  Post,
} from '../model/types'

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получить список постов
    // GET /posts?authorId={authorId}
    getPosts: builder.query<GetPosts['response'], GetPosts['request'] | void>({
      query: (params) => ({
        url: API_ENDPOINTS.POSTS.BASE,
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [...result.items.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Posts', id: 'LIST' }]
          : [{ type: 'Posts', id: 'LIST' }],
    }),

    // Получить один пост по ID
    // GET /posts/{id}
    getPostById: builder.query<GetPostById['response'], GetPostById['request']>({
      query: ({ id }) => EndpointHelpers.posts.byId(id),
      providesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),

    // Получить посты пользователя
    // GET /posts/user/{userId}
    getUserPosts: builder.query<GetUserPosts['response'], GetUserPosts['request']>({
      query: ({ userId, ...params }) => ({
        url: EndpointHelpers.posts.byUser(userId),
        params,
      }),
      providesTags: (result, error, { userId }) =>
        result
          ? [...result.items.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Posts', id: `USER_${userId}` }]
          : [{ type: 'Posts', id: `USER_${userId}` }],
    }),

    // Создать новый пост
    // POST /posts
    createPost: builder.mutation<CreatePost['response'], CreatePost['request']>({
      query: (body) => ({
        url: API_ENDPOINTS.POSTS.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Posts', id: 'LIST' },
              { type: 'Posts', id: `USER_${result.authorId}` },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),

    // Обновить пост
    // PATCH /posts/{id}
    updatePost: builder.mutation<UpdatePost['response'], UpdatePost['request']>({
      query: ({ id, body }) => ({
        url: EndpointHelpers.posts.byId(id),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),

    // Удалить пост
    // DELETE /posts/{id}
    deletePost: builder.mutation<DeletePost['response'], DeletePost['request']>({
      query: ({ id }) => ({
        url: EndpointHelpers.posts.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),

    // Лента подписок (cursor pagination, infinite scroll)
    // GET /posts/feed?cursor=&pageSize=
    getFeed: builder.query<GetFeed['response'], GetFeed['request'] | void>({
      query: (params) => ({
        url: API_ENDPOINTS.POSTS.FEED,
        params: params ?? {},
      }),
      // Один кеш на все cursor-страницы — ключ без cursor.
      serializeQueryArgs: ({ queryArgs }) => {
        if (!queryArgs) return {}
        const { cursor: _cursor, ...rest } = queryArgs
        return rest
      },
      // Аккумулируем страницы при загрузке следующей.
      merge: (currentCache, newData) => {
        if (!currentCache) return newData
        const existingIds = new Set(currentCache.items.map((p) => p.id))
        const uniqueNewItems = newData.items.filter((p) => !existingIds.has(p.id))
        return {
          ...newData,
          items: [...currentCache.items, ...uniqueNewItems],
        }
      },
      // Refetch только при смене cursor (новая страница).
      forceRefetch: ({ currentArg, previousArg }) =>
        (currentArg ?? undefined)?.cursor !== (previousArg ?? undefined)?.cursor,
      providesTags: (result) =>
        result
          ? [...result.items.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Feed', id: 'LIST' }]
          : [{ type: 'Feed', id: 'LIST' }],
    }),

    // Лайк поста
    // PUT /posts/{postId}/like
    likePost: builder.mutation<LikePost['response'], LikePost['request']>({
      query: ({ postId }) => ({
        url: EndpointHelpers.posts.like(postId),
        method: 'PUT',
      }),
      onQueryStarted: async ({ postId }, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState

        const postPatch = dispatch(
          postsApi.util.updateQueryData('getPostById', { id: postId }, (draft) => {
            draft.isLikedByMe = true
            draft.likesCount = (draft.likesCount ?? 0) + 1
          })
        )

        const feedArgs = postsApi.util.selectCachedArgsForQuery(state, 'getFeed')
        const feedPatches = feedArgs.map((args) =>
          dispatch(
            postsApi.util.updateQueryData('getFeed', args, (draft) => {
              const post = draft.items.find((p: Post) => p.id === postId)
              if (post) {
                post.isLikedByMe = true
                post.likesCount = (post.likesCount ?? 0) + 1
              }
            })
          )
        )

        try {
          const { data } = await queryFulfilled
          dispatch(
            postsApi.util.updateQueryData('getPostById', { id: postId }, (draft) => {
              draft.likesCount = data.likesCount
              draft.isLikedByMe = data.isLikedByMe
              draft.recentLikers = data.recentLikers
            })
          )
          feedArgs.forEach((args) =>
            dispatch(
              postsApi.util.updateQueryData('getFeed', args, (draft) => {
                const post = draft.items.find((p: Post) => p.id === postId)
                if (post) {
                  post.likesCount = data.likesCount
                  post.isLikedByMe = data.isLikedByMe
                  post.recentLikers = data.recentLikers
                }
              })
            )
          )
        } catch {
          postPatch.undo()
          feedPatches.forEach((p) => p.undo())
        }
      },
    }),

    // Снятие лайка с поста
    // DELETE /posts/{postId}/like
    unlikePost: builder.mutation<LikePost['response'], LikePost['request']>({
      query: ({ postId }) => ({
        url: EndpointHelpers.posts.like(postId),
        method: 'DELETE',
      }),
      onQueryStarted: async ({ postId }, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState

        const postPatch = dispatch(
          postsApi.util.updateQueryData('getPostById', { id: postId }, (draft) => {
            draft.isLikedByMe = false
            draft.likesCount = Math.max(0, (draft.likesCount ?? 0) - 1)
          })
        )

        const feedArgs = postsApi.util.selectCachedArgsForQuery(state, 'getFeed')
        const feedPatches = feedArgs.map((args) =>
          dispatch(
            postsApi.util.updateQueryData('getFeed', args, (draft) => {
              const post = draft.items.find((p: Post) => p.id === postId)
              if (post) {
                post.isLikedByMe = false
                post.likesCount = Math.max(0, (post.likesCount ?? 0) - 1)
              }
            })
          )
        )

        try {
          const { data } = await queryFulfilled
          dispatch(
            postsApi.util.updateQueryData('getPostById', { id: postId }, (draft) => {
              draft.likesCount = data.likesCount
              draft.isLikedByMe = data.isLikedByMe
              draft.recentLikers = data.recentLikers
            })
          )
          feedArgs.forEach((args) =>
            dispatch(
              postsApi.util.updateQueryData('getFeed', args, (draft) => {
                const post = draft.items.find((p: Post) => p.id === postId)
                if (post) {
                  post.likesCount = data.likesCount
                  post.isLikedByMe = data.isLikedByMe
                  post.recentLikers = data.recentLikers
                }
              })
            )
          )
        } catch {
          postPatch.undo()
          feedPatches.forEach((p) => p.undo())
        }
      },
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetUserPostsQuery,
  useLazyGetUserPostsQuery,
  useGetFeedQuery,
  useLazyGetFeedQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} = postsApi
