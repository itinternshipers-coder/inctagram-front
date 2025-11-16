import { NotificationBell } from '@/shared/ui/NotificationBell/NotificationBell'
import ToolTip from '@/shared/ui/ToolTip/ToolTip'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'

const meta: Meta<typeof NotificationBell> = {
  title: 'Components/NotificationBell',
  component: NotificationBell,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    count: { control: 'number' },
  },
}
export default meta
type Story = StoryObj<typeof NotificationBell>

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 50px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}
