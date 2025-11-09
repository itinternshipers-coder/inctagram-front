import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Recaptcha } from './Recaptcha'

const meta: Meta<typeof Recaptcha> = {
  title: 'Components/Recaptcha',
  component: Recaptcha,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Recaptcha Component

Компонент reCAPTCHA для верификации пользователей. Поддерживает 5 состояний:
- **idle** - начальное состояние (пустой чекбокс)
- **loading** - процесс проверки (крутящийся лоадер)
- **success** - успешная проверка (зелёная галочка)
- **error** - ошибка проверки (красная рамка + сообщение)
- **expired** - истёк срок действия (предупреждение сверху)

## Особенности
- Автоматическое истечение через 2 минуты после успешной проверки
- Автосброс состояния ошибки через 3 секунды
- Анимации для всех переходов состояний
- Полная доступность (ARIA-атрибуты)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialStatus: {
      control: 'select',
      options: ['idle', 'loading', 'success', 'error', 'expired'],
      description: 'Начальное состояние компонента',
      table: {
        type: { summary: 'RecaptchaStatus' },
        defaultValue: { summary: 'idle' },
      },
    },
    expirationTime: {
      control: 'number',
      description: 'Время до истечения в миллисекундах',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '120000' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Отключить компонент',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onStatusChange: {
      action: 'status changed',
      description: 'Callback при изменении статуса',
      table: {
        type: { summary: '(status: RecaptchaStatus) => void' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Recaptcha>

/**
 * Начальное состояние компонента. Пустой чекбокс, готовый к взаимодействию.
 */
export const Idle: Story = {
  args: {
    initialStatus: 'idle',
  },
}

/**
 * Состояние загрузки. Показывает крутящийся лоадер во время проверки.
 */
export const Loading: Story = {
  args: {
    initialStatus: 'loading',
  },
}

/**
 * Успешное прохождение проверки. Отображается зелёная галочка.
 * После 2 минут автоматически переходит в состояние expired.
 */
export const Success: Story = {
  args: {
    initialStatus: 'success',
  },
}

/**
 * Состояние ошибки. Красная рамка вокруг компонента и сообщение об ошибке снизу.
 * Автоматически сбрасывается в idle через 3 секунды.
 */
export const Error: Story = {
  args: {
    initialStatus: 'error',
  },
}

/**
 * Истёк срок действия проверки. Предупреждающее сообщение сверху.
 * Пользователь должен пройти проверку заново.
 */
export const Expired: Story = {
  args: {
    initialStatus: 'expired',
  },
}

/**
 * Отключённый компонент. Не реагирует на клики.
 */
export const Disabled: Story = {
  args: {
    initialStatus: 'idle',
    disabled: true,
  },
}

/**
 * Интерактивный пример с коротким временем истечения (5 секунд).
 * Демонстрирует полный цикл работы компонента.
 */
export const WithShortExpiration: Story = {
  args: {
    initialStatus: 'idle',
    expirationTime: 5000, // 5 секунд
  },
  parameters: {
    docs: {
      description: {
        story: 'Срок действия установлен на 5 секунд для демонстрации перехода в expired состояние.',
      },
    },
  },
}

/**
 * Пример с callback функцией для отслеживания изменения состояния.
 */
export const WithCallback: Story = {
  args: {
    initialStatus: 'idle',
    onStatusChange: (status) => {
      console.log('Status changed to:', status)
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Открой консоль браузера, чтобы увидеть логи изменения состояния.',
      },
    },
  },
}

/**
 * Все состояния в одном view для сравнения.
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>Idle</h3>
        <Recaptcha initialStatus="idle" />
      </div>
      <div>
        <h3>Loading</h3>
        <Recaptcha initialStatus="loading" />
      </div>
      <div>
        <h3>Success</h3>
        <Recaptcha initialStatus="success" />
      </div>
      <div>
        <h3>Error</h3>
        <Recaptcha initialStatus="error" />
      </div>
      <div>
        <h3>Expired</h3>
        <Recaptcha initialStatus="expired" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Визуальное сравнение всех возможных состояний компонента.',
      },
    },
  },
}
