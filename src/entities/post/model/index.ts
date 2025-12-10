// API
export {
  postsApi,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../api/posts-api'

// Types
export type { Post, PostPhoto, GetPosts, GetPostById, CreatePost, UpdatePost, DeletePost } from '../model/types'

// Schemas
export { CreatePostSchema, UpdatePostSchema, CreatePostPhotoSchema } from '../model/schemas'

export type { CreatePostFormData, UpdatePostFormData, CreatePostPhotoData } from '../model/schemas'

// Slice
export {
  postSlice,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  selectPost,
  setAuthorFilter,
  clearFilters,
} from '../model/post-slice'

export {
  selectSelectedPostId,
  selectIsCreateModalOpen,
  selectIsEditModalOpen,
  selectPostFilters,
} from '../model/post-slice'
