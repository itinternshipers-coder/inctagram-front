import { Author } from '@/features/post/model/type'
import * as Dialog from '@radix-ui/react-dialog'

import s from '../PostModal.module.scss'
import { Button } from '../../Button/Button'
import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import TextArea from '../../TextArea/TextArea'
import { useAppDispatch } from '@/shared/lib/hooks'
import { openEditModal } from '@/entities/post/model'

type PostEditHeaderProps = {
  author: Author
  postDataId: string
  value: string
  onValueChange: (value: string) => void
}

export const PostEditHeader = ({ author, postDataId, value, onValueChange }: PostEditHeaderProps) => {
  const dispatch = useAppDispatch()

  return (
    <>
      <div className={s.editWrapper}>
        <div className={s.postXclose}>
          <Dialog.Close asChild>
            <Button variant="tertiary" className={s.menuButton}>
              <CloseOutlineIcon />
            </Button>
          </Dialog.Close>
        </div>

        <div className={s.postHeaderEdit}>
          <div className={s.authorInfo}>
            {author.avatarUrl && <img src={author.avatarUrl} alt={author.username} className={s.authorAvatar} />}
            <strong>{author.username}</strong>
          </div>
        </div>
        <div className={s.editContent}>
          <div className={s.texareaCustom}>
            <TextArea
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              className={s.texareaCustom}
              label="Add publication descriptions"
            />
            <div className={s.charCount}>{value.length}/500</div>
          </div>
          <div className={s.editFooter}>
            <Button onClick={() => dispatch(openEditModal(postDataId))}>Save change </Button>
          </div>
        </div>
      </div>
    </>
  )
}
