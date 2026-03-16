import { Button } from '@inctagram/ui'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Alert } from '@inctagram/ui'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
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
