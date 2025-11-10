import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from './Card'

const meta = {
  component: Card,
  tags: ['autodocs'],
  title: 'Components/Card',
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    style: {
      height: '160px',
      padding: '24px',
      width: '160px',
    },
  },
}
