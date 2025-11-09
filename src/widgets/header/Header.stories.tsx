import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Header } from '@/widgets/header/Header'

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Header>

export const LogIn: Story = {
  name: 'LogiIn ',
  args: {
    isLoginIn: true,
  },
}

export const SignUp: Story = {
  name: 'SignUp ',
  args: {
    isLoginIn: false,
  },
}
