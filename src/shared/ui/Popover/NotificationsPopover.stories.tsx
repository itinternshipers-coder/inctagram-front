import { OutlineBellIcon } from '@/shared/icons/svgComponents'
import NotificationList from '@/shared/ui/Popover/NotificationList'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import NotificationsPopover from './NotificationsPopover'

const notifications = [
  {
    id: '1',
    message: 'Следующий платеж у вас спишется через 1 день',
    isReady: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    message: 'Ваша подписка истекает через 7 дней',
    isReady: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    message: 'Ваша подписка истекает через 7 дней',
    isReady: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    message: 'Ваша подписка активирована и действует до 01.05.2026',
    isReady: true,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '5',
    message: 'Ваша подписка истекает через 1 день',
    isReady: true,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
]

const meta: Meta<typeof NotificationsPopover> = {
  title: 'UI/NotificationsPopover',
  component: NotificationsPopover,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Позиция поповера относительно триггера',
    },
  },
}
export default meta
type Story = StoryObj<typeof NotificationsPopover>

export const Default: Story = {
  args: {
    content: <NotificationList notifications={notifications} onMarkAllAsRead={() => {}} />,
    children: (
      <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
        <OutlineBellIcon />
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: 'red',
            color: 'white',
            fontSize: '11px',
            borderRadius: '50%',
            padding: '0 4px',
            lineHeight: '1.2',
          }}
        >
          2
        </span>
      </button>
    ),
  },
}
