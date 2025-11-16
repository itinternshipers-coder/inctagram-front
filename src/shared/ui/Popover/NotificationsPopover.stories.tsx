import { OutlineBellIcon } from '@/shared/icons/svgComponents'
import NotificationList from '@/shared/ui/Popover/NotificationList'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import NotificationsPopover from './NotificationsPopover'

const notifications = [
  {
    id: '1',
    title: 'Новое уведомление!',
    message: 'Следующий платеж у вас спишется через 1 день',
    date: '1 час назад',
    isNew: true,
  },
  {
    id: '2',
    title: 'Новое уведомление!',
    message: 'Ваша подписка истекает через 7 дней',
    date: '1 день назад',
    isNew: true,
  },
  { id: '3', title: 'Новое уведомление!', message: 'Ваша подписка истекает через 7 дней', date: '3 дня назад' },
  { id: '4', title: 'Новое уведомление!', message: 'Ваша подписка истекает через 7 дней', date: '3 дня назад' },
  { id: '5', title: 'Новое уведомление!', message: 'Ваша подписка истекает через 7 дней', date: '3 дня назад' },
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

// Базовый пример с иконкой и бейджем
export const Default: Story = {
  args: {
    content: <NotificationList notifications={notifications} notificationHandlerAction={() => {}} />,
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
