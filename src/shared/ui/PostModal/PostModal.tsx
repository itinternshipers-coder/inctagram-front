'use client'

import s from './PostModal.module.scss'
import { CommentType, PostModalProps } from '@/features/post/model/type'
import { AuthorMenuItems } from '@/shared/ui/PostModal/PostHeader/PostActionsMenu/AuthorMenuItems/AuthorMenuItems'
import { ViewerMenuItems } from '@/shared/ui/PostModal/PostHeader/PostActionsMenu/ViewerMenuItems/ViewerMenuItems'
import * as Dialog from '@radix-ui/react-dialog'
import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '../Button/Button'
import { ImageGallery } from './ImageGallery/ImageGallery'
import { Comment } from './Comment/Comment'
import { useAppDispatch } from '@/shared/lib/hooks'
import { Modal } from '../Modal/Modal'
import { PostHeader } from './PostHeader/PostHeader'
import { PostEditHeader } from './PostEdit/PostEdit'
import { PostFooter } from './PostFooter/PostFooter'
import { closeCreateModal, closeEditModal } from '@/entities/post/model/post-slice'
import { PostActionsMenu } from './PostHeader/PostActionsMenu/PostActionsMenu'
import { usePostModal, usePostAuthor, usePostActions } from '@/features/post/lib'
import { useAuthContext } from '@/features/auth/lib/use-auth-context'

const PostModal = ({ postData, open, onOpenChange, comments }: PostModalProps) => {
  const displayDate = new Date(postData.createdAt).toLocaleDateString()
  // const comments = postData.comments || []
  const photos = postData.photos || []
  const postModal = usePostModal(postData.id, postData.description ?? '')
  const { author, isAuthor } = usePostAuthor(postData.authorId, postData.author?.username)
  const { isSubscribed, handleToggleSubscribe, handleShare } = usePostActions()
  const { isLoggedIn } = useAuthContext()
  const dispatch = useAppDispatch()

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
                {!postModal.isEditingThisPost && (
                  <PostHeader
                    author={author}
                    actionsMenu={
                      isLoggedIn && (
                        <PostActionsMenu>
                          {isAuthor ? (
                            <AuthorMenuItems onEdit={postModal.handleEditPost} onDelete={postModal.handleDeletePost} />
                          ) : (
                            <ViewerMenuItems
                              onCopy={handleShare}
                              onToggleSubscribe={handleToggleSubscribe}
                              isSubscribed={isSubscribed}
                            />
                          )}
                        </PostActionsMenu>
                      )
                    }
                  />
                )}
                {postModal.isEditingThisPost ? (
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
                          handleOnChange={postModal.handleOnChange}
                        />
                      ))}
                    </div>

                    <PostFooter
                      localLiked={postModal.localLiked}
                      handleToggleLike={postModal.handleToggleLike}
                      handleShare={handleShare}
                      handleAddBookmark={postModal.handleAddBookmark}
                      handlePublishPost={postModal.handlePublishPost}
                      author={author}
                      displayDate={displayDate}
                      setValue={postModal.setValue}
                      value={postModal.value}
                    />
                  </>
                )}
              </div>
            </Dialog.Content>

            {!postModal.isEditingThisPost && (
              <Dialog.Close asChild>
                <Button variant="tertiary" className={s.closeButton}>
                  <CloseOutlineIcon />
                </Button>
              </Dialog.Close>
            )}
          </div>
        </Dialog.Portal>
      </Dialog.Root>
      {postModal.isCreateModalOpen && (
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
            postModal.deletePost({ id: postData.id })
            dispatch(closeCreateModal())
          }}
          onCancel={() => dispatch(closeCreateModal())}
        />
      )}
      {postModal.isEditModalOpen && (
        <Modal
          open={true}
          onOpenChange={() => dispatch(closeEditModal())}
          title="Save changes"
          message="Are you sure you want to save changes to this post?"
          confirmMode={true}
          buttonText="Yes"
          cancelButtonText="No"
          isCancelPrimary={false}
          onAction={postModal.handleSavePost}
          onCancel={postModal.cancelEditPost}
        />
      )}
    </>
  )
}

export default PostModal
