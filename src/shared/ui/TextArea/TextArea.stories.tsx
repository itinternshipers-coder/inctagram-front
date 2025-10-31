import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import TextArea from './TextArea'

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    errorMessage: { control: 'text' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof TextArea>

export default meta

type Story = StoryObj<typeof meta>

// Базовый пример
export const Default: Story = {
  args: {
    label: 'Text area',
    placeholder: 'Placeholder of text area',
    onChange: fn(),
  },
}

// Состояние с ошибкой
export const WithError: Story = {
  args: {
    label: 'Label name with Error',
    placeholder: 'Placeholder with Error',
    error: true,
    errorMessage: 'Error message',
    onChange: fn(),
  },
}

// Отключённое состояние
export const Disabled: Story = {
  args: {
    label: 'Disabled label name',
    value: 'Disabled textarea value',
    disabled: true,
    onChange: fn(),
  },
}

// Пустое значение с ошибкой
export const EmptyWithError: Story = {
  args: {
    label: 'Label name with error',
    value: '',
    error: true,
    errorMessage: 'Error message',
    onChange: fn(),
  },
}
