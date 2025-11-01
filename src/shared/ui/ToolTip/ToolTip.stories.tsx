import NotificationList, { notifications } from '@/shared/ui/ToolTip/NotificationList'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ToolTip from 'src/shared/ui/ToolTip/ToolTip'
import s from '@/shared/ui/ToolTip/ToolTip.module.scss'

const meta: Meta<typeof ToolTip> = {
  title: 'Components/ToolTip',
  component: ToolTip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ToolTip>

export const EmptyNotifications: Story = {
  args: {
    unreadCount: 0,
  },
}

export const SingleNotifications: Story = {
  args: {
    unreadCount: 1,
    content: <NotificationList notifications={[notifications[0]]} />,
    position: 'left',
  },
}

export const ManyNotifications: Story = {
  args: {
    unreadCount: 3,
    content: <NotificationList notifications={notifications} />,
    position: 'right',
  },
}
