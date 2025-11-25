import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import * as Toggle from '@radix-ui/react-toggle'
import { PostModalProps } from './types'
import {
  BookmarkOutlineIcon,
  CloseOutlineIcon,
  HeartOutlineIcon,
  MoreHorizontalOutlineIcon,
  PaperPlaneOutlineIcon,
} from '@/shared/icons/svgComponents'
import { Button } from '../Button/Button'
import s from './PostModal.module.scss'
import { ImageGallery } from './ImageGallery/ImageGallery'
import { Comment } from './Comment/Comment'

const PostModal = ({ postData, open, onOpenChange }: PostModalProps) => {
  const displayDate = new Date(postData.createdAt).toLocaleDateString()
  const comments = postData.comments || []
  const photos = postData.photos || []

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
                    <DropdownMenu.Content className={s.dropdownContent} sideOffset={5}>
                      <DropdownMenu.Item className={s.dropdownItem} onSelect={() => console.log('Edit Post')}>
                        Edit Post
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className={s.dropdownSeparator} />
                      <DropdownMenu.Item
                        className={`${s.dropdownItem} ${s.delete}`}
                        onSelect={() => console.log('Delete Post')}
                      >
                        Delete Post
                      </DropdownMenu.Item>
                      <DropdownMenu.Arrow className={s.dropdownArrow} />
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              <div className={s.commentsWrapper}>
                {postData.description && (
                  <Comment user={postData.author} text={postData.description} time={displayDate} />
                )}

                {comments.map((c) => (
                  <Comment key={c.id} user={c.user} text={c.text} time={c.time} />
                ))}
              </div>

              <div className={s.postFooter}>
                <div className={s.interactionRow}>
                  <div className={s.likesInfo}>
                    <Toggle.Root className={s.likeButton} aria-label="Like Post">
                      <HeartOutlineIcon />
                    </Toggle.Root>
                    <PaperPlaneOutlineIcon />
                  </div>
                  <div className={s.iconButton}>
                    <BookmarkOutlineIcon />
                  </div>
                </div>

                <div className={s.likesInfo}>
                  <img src={postData.author.avatarUrl} alt={postData.author.username} className={s.userThumbnail} />
                  <p className={s.likesCount}>{postData.likesCount} Like</p>
                </div>

                <div className={s.postDate}>{displayDate}</div>

                <div className={s.addCommentSection}>
                  <input placeholder="Add a Comment..." />
                  <button className={s.publishCommentButton}>Publish</button>
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
