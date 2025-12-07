import { Modal } from '@/shared/ui/Modal/Modal'

type Props = {
  postDelete: () => void
  isOpen: boolean
  open: () => void
  close: () => void
  err?: string | null
  loading?: boolean
}

export const DeletePostModal = ({ postDelete, isOpen, open, close, loading, err }: Props) => {
  return (
    <Modal
      open={isOpen}
      onOpenChange={close}
      title={'Delete Post'}
      message={'Are you sure you want to delete this post?'}
      confirmMode={true}
      buttonText={'Yes'}
      onAction={postDelete}
      cancelButtonText={'No'}
      onCancel={close}
    />
  )
}
