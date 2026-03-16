import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'

type PostState = {
  // UI состояние
  selectedPostId: string | null
  isCreateModalOpen: boolean
  isEditModalOpen: boolean

  // Фильтры
  filters: {
    authorId: string | null
  }

  // Оптимистичные обновления
  optimisticLikes: Record<string, boolean>
}

const initialState: PostState = {
  selectedPostId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  filters: {
    authorId: null,
  },
  optimisticLikes: {},
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    // Модалки
    openCreateModal: (state) => {
      state.isCreateModalOpen = true
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false
    },
    openEditModal: (state, action: PayloadAction<string>) => {
      state.selectedPostId = action.payload
      state.isEditModalOpen = true
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false
      state.selectedPostId = null
    },

    // Выбор поста
    selectPost: (state, action: PayloadAction<string | null>) => {
      state.selectedPostId = action.payload
    },

    // Фильтры
    setAuthorFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.authorId = action.payload
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },

    // Оптимистичные лайки
    toggleOptimisticLike: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      state.optimisticLikes[postId] = !state.optimisticLikes[postId]
    },
  },
})

export const {
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  selectPost,
  setAuthorFilter,
  clearFilters,
  toggleOptimisticLike,
} = postSlice.actions

// Селекторы
export const selectSelectedPostId = (state: RootState) => state.post.selectedPostId
export const selectIsCreateModalOpen = (state: RootState) => state.post.isCreateModalOpen
export const selectIsEditModalOpen = (state: RootState) => state.post.isEditModalOpen
export const selectPostFilters = (state: RootState) => state.post.filters
export const selectOptimisticLikes = (state: RootState) => state.post.optimisticLikes

export default postSlice
