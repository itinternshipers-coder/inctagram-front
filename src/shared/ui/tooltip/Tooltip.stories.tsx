import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NotificationTooltip } from 'src/shared/ui/tooltip/Tooltip'

const meta: Meta<typeof NotificationTooltip> = {
  title: 'Components/NotificationTooltip',
  component: NotificationTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof NotificationTooltip>

export const EmptyNotifications: Story = {
  args: {
    notifications: [],
    unreadCount: 0,
  },
}

export const ManyNotifications: Story = {
  args: {
    notifications: [
      {
        id: '1',
        title: 'Новое уведомление!',
        message: 'Следующий платеж у вас спишется через 1 день',
        time: '1 час назад',
        isNew: true,
      },
      {
        id: '2',
        title: 'Новое уведомление!',
        message: 'Ваша подписка истекает через 7 дней',
        time: '1 день назад',
        isNew: true,
      },
      {
        id: '3',
        title: 'Новое уведомление!',
        message: 'Ваша подписка истекает через 7 дней',
        time: '1 день назад',
        isNew: true,
      },
      {
        id: '3',
        title: 'Старое уведомление',
        message: 'Ваш платеж успешно processed',
        time: '3 дня назад',
        isNew: false,
      },
    ],
    unreadCount: 3,
  },
}
