import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import * as Toggle from '@radix-ui/react-toggle'
import { PostModalProps } from './types'
import {
  BookmarkOutlineIcon,
  CloseOutlineIcon,
  Edit2OutlineIcon,
  HeartOutlineIcon,
  MoreHorizontalOutlineIcon,
  PaperPlaneOutlineIcon,
  TrashOutlineIcon,
} from '@/shared/icons/svgComponents'
import { Button } from '../Button/Button'
import { ImageGallery } from './ImageGallery/ImageGallery'
import { Comment } from './Comment/Comment'
import { useState } from 'react'
import s from './PostModal.module.scss'

const PostModal = ({ postData, open, onOpenChange }: PostModalProps) => {
  const displayDate = new Date(postData.createdAt).toLocaleDateString()
  const comments = postData.comments || []
  const photos = postData.photos || []
  const [value, setValue] = useState('')

  // const [toggleLike] = useToggleLikeMutation()
  // const [addBookmark] = useAddBookmarkMutation()
  // const [sharePost] = useSharePostMutation()
  // const [editPost] = useEditPostMutation()
  // const [deletePost] = useDeletePostMutation()
  // const [addComment] = useAddCommentMutation()

  // const [toggleLike] = useToggleLikeMutation()
  // const [localLiked, setLocalLiked] = useState(postData.isLikedByMe)
  const [localLiked, setLocalLiked] = useState(false)
  // const [likesCount, setLikesCount] = useState(postData.likesCount)

  // const handleToggleLike = async () => {
  //   setLocalLiked((prev) => !prev)
  //   setLikesCount((prev) => (localLiked ? prev - 1 : prev + 1))

  //   try {
  //     const res = await toggleLike({ postId: postData.id }).unwrap()
  //     setLocalLiked(res.liked)
  //     setLikesCount(res.likesCount)
  //   } catch (err) {
  //     setLocalLiked(postData.isLikedByMe)
  //     setLikesCount(postData.likesCount)
  //     console.error(err)
  //   }
  // }

  const handlePublishPost = () => {
    //useMutation
  }
  const handleAddBookmark = () => {
    //useMutation
  }
  const handleShare = () => {
    //useMutation
  }
  const handleToggleLike = () => {
    setLocalLiked((prev) => !prev)
    //useMutation
  }
  const handleEditPost = () => {
    //useMutation
  }
  const handleDeletePost = () => {
    //useMutation
  }
  const handleOnChange = (username: string) => {
    setValue(`@${username} `)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.modalOverlay} />

        <div className={s.modalContainer}>
          <Dialog.Content className={s.modalContent}>
            <div className={s.modalLeft}>
              <ImageGallery photos={photos} />
            </div>

            <div className={s.modalRight}>
              <div className={s.postHeader}>
                <div className={s.authorInfo}>
                  <img src={postData.author.avatarUrl} alt={postData.author.username} className={s.authorAvatar} />
                  <strong>{postData.author.username}</strong>
                </div>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button className={s.menuButton} variant="tertiary">
                      <MoreHorizontalOutlineIcon />
                    </Button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className={s.dropdownContent} sideOffset={0} alignOffset={0} align="end">
                      <DropdownMenu.Item className={s.dropdownItem} onSelect={handleEditPost}>
                        <Edit2OutlineIcon />
                        Edit Post
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className={s.dropdownItem} onSelect={handleDeletePost}>
                        <TrashOutlineIcon />
                        Delete Post
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              <div className={s.commentsWrapper}>
                {postData.description && (
                  <Comment user={postData.author} text={postData.description} time={displayDate} />
                )}

                {comments.map((c) => (
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

              <div className={s.postFooter}>
                <div className={s.interactionRow}>
                  <div className={s.likesInfo}>
                    <Toggle.Root className={s.likeButton} aria-label="Like Post">
                      <Button onClick={handleToggleLike} variant="link" className={s.iconButton}>
                        {localLiked ? <HeartOutlineIcon color="red" /> : <HeartOutlineIcon />}
                      </Button>
                    </Toggle.Root>

                    <Button onClick={handleShare} variant="link" className={s.iconButton}>
                      <PaperPlaneOutlineIcon />
                    </Button>
                  </div>

                  <Button className={s.iconButton} onClick={handleAddBookmark} variant="link">
                    <BookmarkOutlineIcon />
                  </Button>
                </div>

                <div className={s.likesInfo}>
                  <img src={postData.author.avatarUrl} alt={postData.author.username} className={s.userThumbnail} />
                  <p className={s.likesCount}>{postData.likesCount} Like</p>
                </div>

                <div className={s.postDate}>{displayDate}</div>

                <div className={s.addCommentSection}>
                  <input placeholder="Add a Comment..." value={value} onChange={(e) => setValue(e.target.value)} />
                  <Button className={s.publishCommentButton} onClick={handlePublishPost}>
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          </Dialog.Content>

          <Dialog.Close asChild>
            <Button variant="tertiary" className={s.closeButton}>
              <CloseOutlineIcon />
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default PostModal

///  variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
