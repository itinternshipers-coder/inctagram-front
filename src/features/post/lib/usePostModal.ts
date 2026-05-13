import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import {
  closeEditModal,
  openCreateModal,
  selectPost,
  selectSelectedPostId,
  selectIsCreateModalOpen,
  selectIsEditModalOpen,
} from '@/entities/post/model/post-slice'
import { useDeletePostMutation, useUpdatePostMutation } from '@/entities/post/model'

export const usePostModal = (postId: string, postDescription: string) => {
  const dispatch = useAppDispatch()
  const selectedPostId = useAppSelector(selectSelectedPostId)
  const isCreateModalOpen = useAppSelector(selectIsCreateModalOpen)
  const isEditModalOpen = useAppSelector(selectIsEditModalOpen)
  const [value, setValue] = useState(postDescription || '')

  const [deletePost] = useDeletePostMutation()
  const [updatePost] = useUpdatePostMutation()

  const isEditingThisPost = selectedPostId === postId

  const handleEditPost = () => {
    setValue(postDescription || '')
    dispatch(selectPost(postId))
  }
  const handleSavePost = () => {
    updatePost({ id: postId, body: { description: value } })
    dispatch(closeEditModal())
    dispatch(selectPost(null))
  }

  const handleDeletePost = () => dispatch(openCreateModal())
  const cancelEditPost = () => dispatch(closeEditModal())

  const handleAddBookmark = () => {
    // TODO: подключить мутацию addBookmark
  }

  return {
    value,
    setValue,
    isEditingThisPost,
    handleEditPost,
    handleSavePost,
    handleDeletePost,
    cancelEditPost,
    handleAddBookmark,
    isCreateModalOpen,
    isEditModalOpen,
    deletePost,
  }
}
