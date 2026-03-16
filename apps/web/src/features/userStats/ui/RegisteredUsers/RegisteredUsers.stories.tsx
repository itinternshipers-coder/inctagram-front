import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RegisteredUsers } from './RegisteredUsers'

const meta: Meta<typeof RegisteredUsers> = {
  title: 'Features/RegisteredUsers',
  component: RegisteredUsers,
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number' },
      description: 'Количество зарегистрированных пользователей',
      defaultValue: 1250,
    },
  },
}

export default meta

type Story = StoryObj<typeof RegisteredUsers>

export const Default: Story = {
  args: {
    count: 1250,
  },
}

export const LargeNumber: Story = {
  args: {
    count: 999999999999999,
  },
}
