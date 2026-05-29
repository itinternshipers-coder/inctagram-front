'use client'

import { useRouter } from 'next/navigation'
import s from './PostModal.module.scss'
import { PostModalProps } from '@/features/post/model/type'
import { AuthorMenuItems } from '@/shared/ui/PostModal/PostHeader/PostActionsMenu/AuthorMenuItems/AuthorMenuItems'
import { ViewerMenuItems } from '@/shared/ui/PostModal/PostHeader/PostActionsMenu/ViewerMenuItems/ViewerMenuItems'
import * as Dialog from '@radix-ui/react-dialog'
import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import { Button } from '../Button/Button'
import { ImageGallery } from './ImageGallery/ImageGallery'
import { Comment, CommentViewModel } from './Comment/Comment'
import { useAppDispatch } from '@/shared/lib/hooks'
import { Modal } from '../Modal/Modal'
import { PostHeader } from './PostHeader/PostHeader'
import { PostEditHeader } from './PostEdit/PostEdit'
import { PostFooter } from './PostFooter/PostFooter'
import { closeCreateModal, closeEditModal, selectPost } from '@/entities/post/model/post-slice'
import { PostActionsMenu } from './PostHeader/PostActionsMenu/PostActionsMenu'
import { usePostModal, usePostAuthor, usePostActions } from '@/features/post/lib'
import { useAuthContext } from '@/features/auth/lib/use-auth-context'
import { formatTimeAgo } from '@/shared/lib/formatTimeAgo'
import { Typography } from '../Typography/Typography'
import { useGetCommentsQuery } from '@/entities/comment/api/comments-api'
import type { Comment as ApiComment } from '@/entities/comment/model'
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { Skeleton } from '../Skeleton/Skeleton'

const COMMENTS_PAGE_SIZE = 10

const mapCommentsToViewModel = (items: ApiComment[], postId: string): CommentViewModel[] => {
  const nodes = new Map<string, CommentViewModel>()
  const roots: CommentViewModel[] = []

  items.forEach((comment) => {
    nodes.set(comment.id, {
      id: comment.id,
      postId,
      user: {
        id: comment.authorId,
        username: comment.userName,
        avatarUrl: comment.avatarUrl ?? null,
      },
      text: comment.content,
      time: formatTimeAgo(comment.createdAt, 'en'),
      likesCount: comment.likesCount,
      isLikedByMe: comment.isLikedByMe,
      replies: [],
    })
  })

  items.forEach((comment) => {
    const currentNode = nodes.get(comment.id)

    if (!currentNode) {
      return
    }

    if (comment.parentCommentId) {
      const parentNode = nodes.get(comment.parentCommentId)

      if (parentNode) {
        parentNode.replies = [...(parentNode.replies ?? []), currentNode]
        return
      }
    }

    roots.push(currentNode)
  })

  return roots
}

const CommentsSkeleton = () => (
  <div className={s.commentsState}>
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={`comment-skeleton-${index}`} className={s.commentSkeletonRow}>
        <Skeleton width={36} height={36} borderRadius="50%" />
        <div className={s.commentSkeletonText}>
          <Skeleton width="70%" height={14} />
          <Skeleton width="45%" height={12} />
        </div>
      </div>
    ))}
  </div>
)

const PostModal = ({ postData, open, onOpenChange }: PostModalProps) => {
  const displayDate = new Date(postData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const relativeTime = formatTimeAgo(postData.createdAt, 'en')
  const photos = postData.photos || []
  const postModal = usePostModal(postData.id, postData.description ?? '')
  const { author, isAuthor } = usePostAuthor(postData.authorId, postData.author?.username)
  const { isSubscribed, handleToggleSubscribe, handleShare } = usePostActions()
  const { isLoggedIn } = useAuthContext()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [cursorMap, setCursorMap] = useState<Record<string, string | undefined>>({})
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const currentCursor = cursorMap[postData.id]

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isFetching: isCommentsFetching,
    isError: isCommentsError,
  } = useGetCommentsQuery({
    postId: postData.id,
    limit: COMMENTS_PAGE_SIZE,
    cursor: currentCursor,
  })

  const hasMoreComments = commentsData?.hasMore ?? false
  const nextCommentsCursor = commentsData?.nextCursor ?? null

  const handleLoadMore = useEffectEvent(() => {
    if (!hasMoreComments || !nextCommentsCursor || isCommentsFetching) {
      return
    }

    setCursorMap((prev) => {
      if (prev[postData.id] === nextCommentsCursor) {
        return prev
      }

      return {
        ...prev,
        [postData.id]: nextCommentsCursor,
      }
    })
  })

  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore()
        }
      },
      {
        rootMargin: '150px',
      }
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasMoreComments, isCommentsFetching, nextCommentsCursor, postData.id])

  const groupedComments = useMemo(
    () => mapCommentsToViewModel(commentsData?.items ?? [], postData.id),
    [commentsData?.items, postData.id]
  )

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            dispatch(selectPost(null))
            dispatch(closeCreateModal())
            dispatch(closeEditModal())
          }
          onOpenChange(isOpen)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className={s.modalOverlay} />
          <div className={s.modalContainer}>
            <Dialog.Content className={s.modalContent} aria-describedby={undefined}>
              <Dialog.Title className={s.visuallyHidden}>Post</Dialog.Title>
              {postModal.isEditingThisPost && (
                <div className={s.postXclose}>
                  <Typography variant="h1">Edit Post</Typography>
                  <Button variant="tertiary" className={s.menuButton} onClick={() => dispatch(selectPost(null))}>
                    <CloseOutlineIcon />
                  </Button>
                </div>
              )}
              <div className={s.modalBody}>
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
                              <AuthorMenuItems
                                onEdit={postModal.handleEditPost}
                                onDelete={postModal.handleDeletePost}
                              />
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
                    <PostEditHeader
                      author={author}
                      postDataId={postData.id}
                      value={postModal.value}
                      onValueChange={postModal.setValue}
                    />
                  ) : (
                    <>
                      <div className={s.commentsWrapper}>
                        {postData.description && (
                          <Comment
                            id={`post-description-${postData.id}`}
                            postId={postData.id}
                            user={author}
                            text={postData.description}
                            time={relativeTime}
                            likesCount={0}
                            isLikedByMe={false}
                            canLike={false}
                            canReply={false}
                          />
                        )}

                        {isCommentsLoading ? (
                          <CommentsSkeleton />
                        ) : isCommentsError ? (
                          <p className={s.commentsState}>Failed to load comments</p>
                        ) : groupedComments.length === 0 ? (
                          <p className={s.commentsState}>No comments yet</p>
                        ) : (
                          <>
                            {groupedComments.map((comment) => (
                              <Comment
                                key={comment.id}
                                id={comment.id}
                                postId={comment.postId}
                                user={comment.user}
                                text={comment.text}
                                time={comment.time}
                                likesCount={comment.likesCount}
                                isLikedByMe={comment.isLikedByMe}
                                replies={comment.replies}
                              />
                            ))}
                            <div ref={sentinelRef} className={s.commentsSentinel} aria-hidden="true" />
                            {isCommentsFetching && <CommentsSkeleton />}
                          </>
                        )}
                      </div>

                      <PostFooter
                        postId={postData.id}
                        isLikedByMe={postData.isLikedByMe}
                        likesCount={postData.likesCount}
                        handleShare={handleShare}
                        handleAddBookmark={postModal.handleAddBookmark}
                        author={author}
                        displayDate={displayDate}
                      />
                    </>
                  )}
                </div>
              </div>

              {!postModal.isEditingThisPost && (
                <Dialog.Close asChild>
                  <Button variant="link" className={s.closeButton}>
                    <CloseOutlineIcon />
                  </Button>
                </Dialog.Close>
              )}
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
      {postModal.isCreateModalOpen && (
        <Modal
          open={true}
          onOpenChange={() => dispatch(closeCreateModal())}
          title="Delete post"
          message="Are you sure you want to delete this post?"
          confirmMode={true}
          buttonText="Yes"
          cancelButtonText="No"
          isCancelPrimary={true}
          onAction={() => {
            postModal.deletePost({ id: postData.id })
            dispatch(closeCreateModal())
            router.back()
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
