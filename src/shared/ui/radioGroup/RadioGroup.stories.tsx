import { RadioGroup } from '@/shared/ui/radioGroup/RadioGroup'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Текущее выбранное значение',
    },
    onChange: {
      action: 'changed',
      description: 'Callback при изменении значения',
    },
    name: {
      control: 'text',
      description: 'Имя группы радио-кнопок',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключить всю группу',
    },
    className: {
      control: 'text',
      description: 'Дополнительный CSS класс',
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

// Базовые опции для историй
const defaultOptions = [
  { value: 'option1', label: 'RadioGroup' },
  { value: 'option2', label: 'RadioGroup' },
]

const multipleOptions = [
  { value: 'option1', label: 'Вариант 1' },
  { value: 'option2', label: 'Вариант 2' },
  { value: 'option3', label: 'Вариант 3' },
  { value: 'option4', label: 'Вариант 4' },
]

// Default - не выбрано ничего
export const Default: Story = {
  args: {
    options: defaultOptions,
    value: '',
    name: 'default-radio',
    disabled: false,
  },
}

// Active - первая опция выбрана
export const Active: Story = {
  args: {
    options: defaultOptions,
    value: 'option1',
    name: 'active-radio',
    disabled: false,
  },
}

// Hover - демонстрация hover состояния
export const Hover: Story = {
  args: {
    options: defaultOptions,
    value: '',
    name: 'hover-radio',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Наведите курсор на радио-кнопки, чтобы увидеть hover эффект',
      },
    },
  },
}

// Focus - демонстрация focus состояния
export const Focus: Story = {
  args: {
    options: defaultOptions,
    value: '',
    name: 'focus-radio',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Используйте Tab для навигации и увидите focus outline',
      },
    },
  },
}

// Disabled - вся группа отключена
export const Disabled: Story = {
  args: {
    options: defaultOptions,
    value: 'option1',
    name: 'disabled-radio',
    disabled: true,
  },
}

// Disabled - без выбранного значения
export const DisabledUnselected: Story = {
  args: {
    options: defaultOptions,
    value: '',
    name: 'disabled-unselected-radio',
    disabled: true,
  },
}

// Partial Disabled - некоторые опции отключены
export const PartialDisabled: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Активная опция' },
      { value: 'option2', label: 'Отключенная опция', disabled: true },
      { value: 'option3', label: 'Активная опция' },
    ],
    value: '',
    name: 'partial-disabled-radio',
  },
  parameters: {
    docs: {
      description: {
        story: 'Отдельные опции могут быть отключены через свойство disabled',
      },
    },
  },
}

// Selected Disabled - выбранная опция отключена
export const SelectedDisabled: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Выбранная и отключенная', disabled: true },
      { value: 'option2', label: 'Активная опция' },
    ],
    value: 'option1',
    name: 'selected-disabled-radio',
  },
}

// Multiple Options - много опций
export const MultipleOptions: Story = {
  args: {
    options: multipleOptions,
    value: 'option2',
    name: 'multiple-radio',
  },
}

// Long Labels - длинные метки
export const LongLabels: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Это очень длинная метка для радио-кнопки' },
      { value: 'option2', label: 'Короткая метка' },
      { value: 'option3', label: 'Еще одна длинная метка с дополнительным текстом' },
    ],
    value: 'option1',
    name: 'long-labels-radio',
  },
}

// Interactive - с контролируемым состоянием
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('option1')

    return (
      <div>
        <RadioGroup {...args} value={value} onChange={setValue} />
        <p style={{ color: '#fff', marginTop: '20px', fontSize: '14px' }}>
          Выбрано: <strong>{value || 'ничего'}</strong>
        </p>
      </div>
    )
  },
  args: {
    options: defaultOptions,
    name: 'interactive-radio',
  },
  parameters: {
    docs: {
      description: {
        story: 'Интерактивный пример с отображением выбранного значения',
      },
    },
  },
}

// All States - демонстрация всех состояний
export const AllStates = {
  render: () => {
    const [state1, setState1] = useState('')
    const [state2, setState2] = useState('option1')
    const [state3, setState3] = useState('')
    const [state4, setState4] = useState('')
    const [state5, setState5] = useState('option1')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>Default</h3>
          <RadioGroup options={defaultOptions} value={state1} onChange={setState1} name="all-states-default" />
        </div>

        <div>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>Active</h3>
          <RadioGroup options={defaultOptions} value={state2} onChange={setState2} name="all-states-active" />
        </div>

        <div>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>Hover (наведите курсор)</h3>
          <RadioGroup options={defaultOptions} value={state3} onChange={setState3} name="all-states-hover" />
        </div>

        <div>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>Focus (используйте Tab)</h3>
          <RadioGroup options={defaultOptions} value={state4} onChange={setState4} name="all-states-focus" />
        </div>

        <div>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>Disabled</h3>
          <RadioGroup
            options={defaultOptions}
            value={state5}
            onChange={setState5}
            name="all-states-disabled"
            disabled
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация всех состояний компонента из макета',
      },
    },
  },
}

// Custom Styling - с кастомным классом
export const CustomStyling: Story = {
  args: {
    options: defaultOptions,
    value: 'option1',
    name: 'custom-radio',
    className: 'custom-radio-class',
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент поддерживает дополнительные CSS классы через prop className',
      },
    },
  },
}

// RTL Support - поддержка RTL
export const RTLSupport: Story = {
  args: {
    options: [
      { value: 'option1', label: 'خيار 1' },
      { value: 'option2', label: 'خيار 2' },
    ],
    value: 'option1',
    name: 'rtl-radio',
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент корректно работает с RTL языками',
      },
    },
  },
}
