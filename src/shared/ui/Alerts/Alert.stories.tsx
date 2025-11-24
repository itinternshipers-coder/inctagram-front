import { Button } from '@/shared/ui/Button/Button'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Alerts } from 'src/shared/ui/Alerts/Alert'

const meta: Meta<typeof Alerts> = {
  title: 'Components/Alerts',
  component: Alerts,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Button>
export const AlertsStatusSuccess: Story = {
  name: 'StatusSuccess ',
  args: {
    status: 'success',
    text: '',
    position: 'bottom-left',
  },
}

export const AlertsErrorSuccess: Story = {
  name: 'StatusError ',
  args: {
    status: 'error',
    text: '',
    position: 'bottom-left',
  },
}
