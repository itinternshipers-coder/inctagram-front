import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import NotificationsPopover from './NotificationsPopover'
import { NotificationList } from './NotificationList'
import { OutlineBellIcon } from '@/shared/icons/svgComponents'

// 📋 Пример уведомлений
const notifications = [
  { id: '1', title: 'Новое уведомление!', message: 'Следующий платёж через 1 день', time: '1 час назад', isNew: true },
  {
    id: '2',
    title: 'Новое уведомление!',
    message: 'Подписка истекает через 7 дней',
    time: '1 день назад',
    isNew: true,
  },
  { id: '3', title: 'Старое уведомление', message: 'Платёж успешно обработан', time: '3 дня назад' },
]

const meta: Meta<typeof NotificationsPopover> = {
  title: 'UI/NotificationsPopover',
  component: NotificationsPopover,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    unreadCount: {
      control: { type: 'number' },
      description: 'Количество непрочитанных уведомлений (badge)',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Позиция поповера относительно триггера',
    },
  },
}
export default meta
type Story = StoryObj<typeof NotificationsPopover>

// ——————————————————————————————————————
// 🟢 Базовый пример
// ——————————————————————————————————————
export const Default: Story = {
  args: {
    unreadCount: 2,
    content: <NotificationList notifications={notifications} />,
  },
}

// ——————————————————————————————————————
// 🟡 Без новых уведомлений
// ——————————————————————————————————————
export const NoUnread: Story = {
  args: {
    unreadCount: 0,
    content: <NotificationList notifications={notifications.map((n) => ({ ...n, isNew: false }))} />,
  },
}

// ——————————————————————————————————————
// 🔵 Пустой список уведомлений
// ——————————————————————————————————————
export const Empty: Story = {
  args: {
    unreadCount: 0,
    content: <div style={{ padding: '20px', textAlign: 'center', opacity: 0.7 }}>Нет уведомлений</div>,
  },
}

// ——————————————————————————————————————
// 🟣 Кастомный триггер (например, кнопка)
// ——————————————————————————————————————
export const CustomTrigger: Story = {
  args: {
    unreadCount: 1,
    content: <NotificationList notifications={notifications.slice(0, 1)} />,
    children: (
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#1e1e1e',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #333',
        }}
      >
        <OutlineBellIcon /> Уведомления
      </button>
    ),
  },
}
