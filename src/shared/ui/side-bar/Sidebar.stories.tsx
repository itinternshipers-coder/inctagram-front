import Sidebar from '@/shared/ui/side-bar/Sidebar'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Default: Story = {}
