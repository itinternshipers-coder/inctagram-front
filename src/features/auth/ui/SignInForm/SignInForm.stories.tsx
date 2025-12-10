import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import SignInForm from './SignInForm'

const meta = {
  title: 'Features/Auth/SignInForm',
  component: SignInForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SignInForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
