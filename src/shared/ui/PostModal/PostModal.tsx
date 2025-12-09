import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '../Button/Button'
import { ImageGallery } from './ImageGallery/ImageGallery'
import { Comment } from './Comment/Comment'
import { useDeletePostMutation, useUpdatePostMutation } from '@/entities/post/model'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { Modal } from '../Modal/Modal'
import { PostHeader } from './PostHeader/PostHeader'
import { PostEditHeader } from './PostEdit/PostEdit'
import { PostFooter } from './PostFooter/PostFooter'
import {
  openCreateModal,
  closeCreateModal,
  closeEditModal,
  selectPost,
  toggleOptimisticLike,
  selectSelectedPostId,
  selectIsCreateModalOpen,
  selectIsEditModalOpen,
} from '@/entities/post/model/post-slice'
import s from './PostModal.module.scss'

export type PhotoType = {
  photoId: string
  url: string
  order: number
  createdAt: string
}

export type UserPostType = {
  id: string
  authorId: string
  userName: string
  description?: string
  createdAt: string
  updatedAt: string
  photos?: PhotoType[]
}

export type Author = {
  id: string
  username: string
  avatarUrl: string
}

export type CommentType = {
  id: string
  user: Author
  text: string
  likesCount?: number
  time: string
  replies?: CommentType[]
}

export type PostModalProps = {
  postData: UserPostType
  open: boolean
  onOpenChange: (open: boolean) => void
  comments: CommentType[]
}

const PostModal = ({ postData, open, onOpenChange, comments }: PostModalProps) => {
  const displayDate = new Date(postData.createdAt).toLocaleDateString()
  // const comments = postData.comments || []
  const photos = postData.photos || []
  const [value, setValue] = useState('')
  const [localLiked, setLocalLiked] = useState(false)

  const [deletePost] = useDeletePostMutation()
  const [updatePost] = useUpdatePostMutation()

  const dispatch = useAppDispatch()

  const selectedPostId = useAppSelector(selectSelectedPostId)
  const IsCreateModalOpen = useAppSelector(selectIsCreateModalOpen)
  const isEditModalOpen = useAppSelector(selectIsEditModalOpen)

  const isEditingThisPost = selectedPostId === postData.id

  // Временный объект автора, если у тебя нет отдельного author в API
  const author = {
    id: postData.authorId,
    username: 'NoName',
    avatarUrl: '',
  }

  const handleToggleLike = () => {
    dispatch(toggleOptimisticLike(postData.id))
  }

  const handleAddBookmark = () => {
    // TODO: подключить мутацию addBookmark
  }

  const handleShare = () => {
    // TODO: подключить мутацию sharePost
  }

  const cancelEditPost = () => {
    dispatch(closeEditModal())
  }

  const handleEditPost = () => {
    setValue(postData.description || '')
    dispatch(selectPost(postData.id))
  }

  const handleSavePost = () => {
    updatePost({ id: postData.id, body: { description: value } })
    dispatch(closeEditModal())
  }

  const handleDeletePost = () => {
    dispatch(openCreateModal())
  }

  const handlePublishPost = () => {
    // TODO: подключить мутацию addComment
    setValue('')
  }

  const handleOnChange = (username: string) => {
    setValue(`@${username} `)
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className={s.modalOverlay} />
          <div className={s.modalContainer}>
            <Dialog.Content className={s.modalContent}>
              <div className={s.modalLeft}>
                <ImageGallery photos={photos} />
              </div>

              <div className={s.modalRight}>
                {!isEditingThisPost && (
                  <PostHeader author={author} onEdit={handleEditPost} onDelete={handleDeletePost} />
                )}
                {isEditingThisPost ? (
                  <PostEditHeader author={author} postDataId={postData.id} />
                ) : (
                  <>
                    <div className={s.commentsWrapper}>
                      {postData.description && <Comment user={author} text={postData.description} time={displayDate} />}

                      {comments.map((c: CommentType) => (
                        <Comment
                          key={c.id}
                          user={c.user}
                          text={c.text}
                          time={c.time}
                          likesCount={c.likesCount}
                          replies={c.replies}
                          handleOnChange={handleOnChange}
                        />
                      ))}
                    </div>

                    <PostFooter
                      localLiked={localLiked}
                      handleToggleLike={handleToggleLike}
                      handleShare={handleShare}
                      handleAddBookmark={handleAddBookmark}
                      handlePublishPost={handlePublishPost}
                      author={author}
                      displayDate={displayDate}
                      setValue={setValue}
                      value={value}
                    />
                  </>
                )}
              </div>
            </Dialog.Content>

            {!isEditingThisPost && (
              <Dialog.Close asChild>
                <Button variant="tertiary" className={s.closeButton}>
                  <CloseOutlineIcon />
                </Button>
              </Dialog.Close>
            )}
          </div>
        </Dialog.Portal>
      </Dialog.Root>
      {IsCreateModalOpen && (
        <Modal
          open={true}
          onOpenChange={() => {}}
          title="Delete post"
          message="Are you sure you want to delete this post?"
          confirmMode={true}
          buttonText="Yes"
          cancelButtonText="No"
          isCancelPrimary={true}
          onAction={() => {
            deletePost({ id: postData.id })
            dispatch(closeCreateModal())
          }}
          onCancel={() => dispatch(closeCreateModal())}
        />
      )}
      {isEditModalOpen && (
        <Modal
          open={true}
          onOpenChange={() => dispatch(closeEditModal())}
          title="Save changes"
          message="Are you sure you want to save changes to this post?"
          confirmMode={true}
          buttonText="Yes"
          cancelButtonText="No"
          isCancelPrimary={false}
          onAction={handleSavePost}
          onCancel={cancelEditPost}
        />
      )}
    </>
  )
}

export default PostModal
