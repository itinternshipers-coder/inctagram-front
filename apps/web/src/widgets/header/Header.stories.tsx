import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Header } from '@/widgets/header/Header'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'

const meta: Meta<typeof Header> = {
  title: 'Widgets/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
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
