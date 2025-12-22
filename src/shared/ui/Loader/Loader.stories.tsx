import Loader from '@/shared/ui/Loader/Loader'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Loader>
export const Default: Story = {}
