import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import {
  closeEditModal,
  openCreateModal,
  selectPost,
  toggleOptimisticLike,
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
  const [localLiked, setLocalLiked] = useState(false)

  const [deletePost] = useDeletePostMutation()
  const [updatePost] = useUpdatePostMutation()

  const isEditingThisPost = selectedPostId === postId

  const handleToggleLike = () => dispatch(toggleOptimisticLike(postId))
  const handleEditPost = () => {
    setValue(postDescription || '')
    dispatch(selectPost(postId))
  }
  const handleSavePost = () => {
    updatePost({ id: postId, body: { description: value } })
    dispatch(closeEditModal())
  }
  const handleOnChange = (username: string) => {
    setValue(`@${username} `)
  }

  const handleDeletePost = () => dispatch(openCreateModal())
  const cancelEditPost = () => dispatch(closeEditModal())
  const handlePublishPost = () => setValue('')

  const handleAddBookmark = () => {
    // TODO: подключить мутацию addBookmark
  }

  return {
    value,
    setValue,
    localLiked,
    setLocalLiked,
    isEditingThisPost,
    handleToggleLike,
    handleEditPost,
    handleSavePost,
    handleDeletePost,
    cancelEditPost,
    handlePublishPost,
    handleAddBookmark,
    handleOnChange,
    isCreateModalOpen,
    isEditModalOpen,
    deletePost,
  }
}
