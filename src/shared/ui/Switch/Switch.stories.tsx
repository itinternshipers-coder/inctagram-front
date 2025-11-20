import { Switch } from '@/shared/ui/Switch/Switch'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
}
export default meta
type Story = StoryObj<typeof Switch>

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
