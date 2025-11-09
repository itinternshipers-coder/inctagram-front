import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './Input'
import '@/app/globals.scss'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Универсальный компонент ввода с поддержкой различных типов (email, password, search, text), валидации, состояний disabled и встроенными иконками.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Текст лейбла над полем',
      control: 'text',
    },
    type: {
      description: 'Тип input элемента',
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'number', 'tel', 'url'],
    },
    placeholder: {
      description: 'Placeholder текст',
      control: 'text',
    },
    error: {
      description: 'Текст ошибки валидации',
      control: 'text',
    },
    disabled: {
      description: 'Отключенное состояние',
      control: 'boolean',
    },
    value: {
      description: 'Значение поля',
      control: 'text',
    },
    autoFocus: {
      description: 'Автоматический фокус при загрузке',
      control: 'boolean',
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Type something...',
  },
}

export default meta

type Story = StoryObj<typeof Input>

// === Default States ===
export const Default: Story = {
  args: {
    label: 'Default input',
    type: 'text',
  },
  parameters: {
    docs: {
      description: {
        story: 'Базовый вариант input без дополнительных опций.',
      },
    },
  },
}

// === Active States ===
export const ActiveEmail: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'example@mail.com',
    value: 'user@example.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'Email input с заполненным значением.',
      },
    },
  },
}

export const ActivePassword: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    value: 'mypassword123',
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input с кнопкой показа/скрытия пароля. Зажмите кнопку глаза чтобы увидеть пароль.',
      },
    },
  },
}

export const ActiveSearch: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
    value: 'React components',
  },
  parameters: {
    docs: {
      description: {
        story: 'Search input с иконкой лупы слева.',
      },
    },
  },
}

// === Focus States ===
export const FocusEmail: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'example@mail.com',
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Email input с автоматическим фокусом при загрузке страницы.',
      },
    },
  },
}

export const FocusPassword: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input с автофокусом.',
      },
    },
  },
}

export const FocusSearch: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search input с автофокусом.',
      },
    },
  },
}

// === Error States ===
export const ErrorEmail: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'example@mail.com',
    error: 'Please enter a valid email address',
    value: 'invalid-email',
  },
  parameters: {
    docs: {
      description: {
        story: 'Email input с ошибкой валидации. Красная рамка и текст ошибки под полем.',
      },
    },
  },
}

export const ErrorPassword: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    error: 'Password must be at least 8 characters',
    value: '123',
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input с ошибкой валидации.',
      },
    },
  },
}

export const ErrorSearch: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
    error: 'Search query is too short',
    value: 'ab',
  },
  parameters: {
    docs: {
      description: {
        story: 'Search input с ошибкой валидации.',
      },
    },
  },
}

// === Disabled States ===
export const DisabledEmail: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'example@mail.com',
    disabled: true,
    value: 'disabled@example.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'Email input в отключенном состоянии. Сниженная прозрачность и серый цвет текста.',
      },
    },
  },
}

export const DisabledPassword: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    disabled: true,
    value: 'disabledpassword',
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input в disabled состоянии. Кнопка показа пароля также неактивна.',
      },
    },
  },
}

export const DisabledSearch: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
    disabled: true,
    value: 'Disabled search query',
  },
  parameters: {
    docs: {
      description: {
        story: 'Search input в disabled состоянии. Иконка лупы также тускнеет.',
      },
    },
  },
}

// === Playground ===
export const Playground: Story = {
  args: {
    label: 'Playground',
    type: 'text',
    placeholder: 'Experiment with controls...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Используйте Controls панель ниже для экспериментов с различными пропсами компонента.',
      },
    },
  },
}
