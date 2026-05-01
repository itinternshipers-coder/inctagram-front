import { baseApi } from '@/shared/api/base-api'
import { EndpointHelpers } from '@/shared/api/endpoints'
import type { RootState } from '@/store/store'
import type { Comment, CreateComment, CreateReply, GetComments, LikeComment } from '../model/types'

const makeOptimisticId = () => `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /posts/{postId}/comments?cursor=&limit=
    getComments: builder.query<GetComments['response'], GetComments['request']>({
      query: ({ postId, ...params }) => ({
        url: EndpointHelpers.posts.comments(postId),
        params,
      }),
      // Один кеш на все cursor-страницы конкретного postId (плюс limit, если задан).
      serializeQueryArgs: ({ queryArgs }) => {
        const { cursor: _cursor, ...rest } = queryArgs
        return rest
      },
      merge: (currentCache, newData) => {
        if (!currentCache) return newData
        return {
          ...newData,
          items: [...currentCache.items, ...newData.items],
        }
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      providesTags: (_result, _error, { postId }) => [{ type: 'Comments', id: postId }],
    }),

    // POST /posts/{postId}/comments
    createComment: builder.mutation<CreateComment['response'], CreateComment['request']>({
      query: ({ postId, content }) => ({
        url: EndpointHelpers.posts.comments(postId),
        method: 'POST',
        body: { content },
      }),
      onQueryStarted: async (
        { postId, content, currentUserId, currentUserName },
        { dispatch, queryFulfilled, getState }
      ) => {
        const tempId = makeOptimisticId()
        const tempComment: Comment = {
          id: tempId,
          postId,
          content,
          authorId: currentUserId ?? '',
          userName: currentUserName ?? '',
          avatarUrl: null,
          createdAt: new Date().toISOString(),
          isMyComment: true,
          parentCommentId: null,
          likesCount: 0,
          isLikedByMe: false,
        }

        const argsList = commentsApi.util
          .selectCachedArgsForQuery(getState() as RootState, 'getComments')
          .filter((a) => a.postId === postId)

        const patches = argsList.map((args) =>
          dispatch(
            commentsApi.util.updateQueryData('getComments', args, (draft) => {
              draft.items.unshift(tempComment)
            })
          )
        )

        try {
          const { data } = await queryFulfilled
          argsList.forEach((args) =>
            dispatch(
              commentsApi.util.updateQueryData('getComments', args, (draft) => {
                const idx = draft.items.findIndex((c) => c.id === tempId)
                if (idx !== -1) {
                  draft.items[idx] = data
                } else {
                  draft.items.unshift(data)
                }
              })
            )
          )
        } catch {
          patches.forEach((p) => p.undo())
        }
      },
    }),

    // POST /posts/{postId}/comments/{commentId}/replies
    createReply: builder.mutation<CreateReply['response'], CreateReply['request']>({
      query: ({ postId, commentId, content }) => ({
        url: EndpointHelpers.posts.reply(postId, commentId),
        method: 'POST',
        body: { content },
      }),
      onQueryStarted: async (
        { postId, commentId, content, currentUserId, currentUserName },
        { dispatch, queryFulfilled, getState }
      ) => {
        const tempId = makeOptimisticId()
        const tempReply: Comment = {
          id: tempId,
          postId,
          content,
          authorId: currentUserId ?? '',
          userName: currentUserName ?? '',
          avatarUrl: null,
          createdAt: new Date().toISOString(),
          isMyComment: true,
          parentCommentId: commentId,
          likesCount: 0,
          isLikedByMe: false,
        }

        const argsList = commentsApi.util
          .selectCachedArgsForQuery(getState() as RootState, 'getComments')
          .filter((a) => a.postId === postId)

        const patches = argsList.map((args) =>
          dispatch(
            commentsApi.util.updateQueryData('getComments', args, (draft) => {
              draft.items.unshift(tempReply)
            })
          )
        )

        try {
          const { data } = await queryFulfilled
          argsList.forEach((args) =>
            dispatch(
              commentsApi.util.updateQueryData('getComments', args, (draft) => {
                const idx = draft.items.findIndex((c) => c.id === tempId)
                if (idx !== -1) {
                  draft.items[idx] = data
                } else {
                  draft.items.unshift(data)
                }
              })
            )
          )
        } catch {
          patches.forEach((p) => p.undo())
        }
      },
    }),

    // PUT /posts/{postId}/comments/{commentId}/like
    likeComment: builder.mutation<LikeComment['response'], LikeComment['request']>({
      query: ({ postId, commentId }) => ({
        url: EndpointHelpers.posts.commentLike(postId, commentId),
        method: 'PUT',
      }),
      onQueryStarted: async ({ postId, commentId }, { dispatch, queryFulfilled, getState }) => {
        const argsList = commentsApi.util
          .selectCachedArgsForQuery(getState() as RootState, 'getComments')
          .filter((a) => a.postId === postId)

        const patches = argsList.map((args) =>
          dispatch(
            commentsApi.util.updateQueryData('getComments', args, (draft) => {
              const c = draft.items.find((c) => c.id === commentId)
              if (c) {
                c.isLikedByMe = true
                c.likesCount = (c.likesCount ?? 0) + 1
              }
            })
          )
        )

        try {
          const { data } = await queryFulfilled
          argsList.forEach((args) =>
            dispatch(
              commentsApi.util.updateQueryData('getComments', args, (draft) => {
                const c = draft.items.find((c) => c.id === commentId)
                if (c) {
                  c.likesCount = data.likesCount
                  c.isLikedByMe = data.isLikedByMe
                }
              })
            )
          )
        } catch {
          patches.forEach((p) => p.undo())
        }
      },
    }),

    // DELETE /posts/{postId}/comments/{commentId}/like
    unlikeComment: builder.mutation<LikeComment['response'], LikeComment['request']>({
      query: ({ postId, commentId }) => ({
        url: EndpointHelpers.posts.commentLike(postId, commentId),
        method: 'DELETE',
      }),
      onQueryStarted: async ({ postId, commentId }, { dispatch, queryFulfilled, getState }) => {
        const argsList = commentsApi.util
          .selectCachedArgsForQuery(getState() as RootState, 'getComments')
          .filter((a) => a.postId === postId)

        const patches = argsList.map((args) =>
          dispatch(
            commentsApi.util.updateQueryData('getComments', args, (draft) => {
              const c = draft.items.find((c) => c.id === commentId)
              if (c) {
                c.isLikedByMe = false
                c.likesCount = Math.max(0, (c.likesCount ?? 0) - 1)
              }
            })
          )
        )

        try {
          const { data } = await queryFulfilled
          argsList.forEach((args) =>
            dispatch(
              commentsApi.util.updateQueryData('getComments', args, (draft) => {
                const c = draft.items.find((c) => c.id === commentId)
                if (c) {
                  c.likesCount = data.likesCount
                  c.isLikedByMe = data.isLikedByMe
                }
              })
            )
          )
        } catch {
          patches.forEach((p) => p.undo())
        }
      },
    }),
  }),
})

export const {
  useGetCommentsQuery,
  useLazyGetCommentsQuery,
  useCreateCommentMutation,
  useCreateReplyMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
} = commentsApi
