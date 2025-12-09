import { DeletePostModal } from '@/features/post/ui/deletePostModal/DeletePostModal'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof DeletePostModal> = {
  title: 'Features/Post/DeletePostModal',
  component: DeletePostModal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    postDelete: { action: 'postDelete' },
    close: { action: 'close' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Delete Post',
    message: 'Are you sure you want to delete this post?',
    isOpen: true,
  },
}
