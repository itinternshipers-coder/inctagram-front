import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import ConfirmModal from 'src/shared/ui/ConfirmModal/ConfirmModal'

const meta: Meta<typeof ConfirmModal> = {
  title: 'Components/ConfirmModal',
  component: ConfirmModal,
}

export default meta

type Story = StoryObj<typeof ConfirmModal>

export const Default: Story = {
  args: {
    openModal: true,
    title: 'Log Out',
    text: 'Are you really want to log out of your account "Epam@epam.com"?',
    onConfirm: action('Confirmed logout'),
    closeModal: action('Closed modal'),
  },
}

export const DeletePhoto: Story = {
  args: {
    openModal: true,
    title: 'Delete Photo',
    text: 'Are you sure you want to delete the photo?',
    onConfirm: action('Photo deleted'),
    closeModal: action('Closed modal'),
  },
}
