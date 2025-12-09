import { Modal } from '@/shared/ui/Modal/Modal'

type Props = {
  title: string
  message: string
  postDelete: () => void
  isOpen: boolean
  close: () => void
}

export const DeletePostModal = ({ title, message, postDelete, isOpen, close }: Props) => {
  return (
    <Modal
      open={isOpen}
      onOpenChange={close}
      title={title}
      message={message}
      confirmMode={true}
      buttonText={'No'}
      onAction={close}
      cancelButtonText={'Yes'}
      onCancel={postDelete}
    />
  )
}
