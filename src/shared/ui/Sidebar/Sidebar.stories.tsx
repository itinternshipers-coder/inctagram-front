import { Meta, StoryObj } from '@storybook/nextjs-vite'
import Sidebar from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'radio',
      options: ['user', 'admin'],
      description: 'Switch between user and admin roles',
    },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Default: Story = {
  args: {
    role: 'user',
  },
}
