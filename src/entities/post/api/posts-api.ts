import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'
import type { GetPosts, GetPostById, CreatePost, UpdatePost, DeletePost } from '../model/types'

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
          ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Posts', id: 'LIST' }]
          : [{ type: 'Posts', id: 'LIST' }],
    }),

    // Получить один пост по ID
    // GET /posts/{id}
    getPostById: builder.query<GetPostById['response'], GetPostById['request']>({
      query: ({ id }) => EndpointHelpers.posts.byId(id),
      providesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),

    // Создать новый пост
    // POST /posts
    createPost: builder.mutation<CreatePost['response'], CreatePost['request']>({
      query: (body) => ({
        url: API_ENDPOINTS.POSTS.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
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
  }),
})

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi
