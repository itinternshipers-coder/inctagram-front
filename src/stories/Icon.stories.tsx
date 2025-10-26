import { Icon } from '@/shared/ui/icon/Icon'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    iconId: {
      control: { type: 'select' },
      options: ['feed', 'plus', 'profile', 'message', 'search', 'statistics', 'favorites', 'logout'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    iconId: 'feed',
    width: '48px',
    height: '48px',
  },
}

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {['feed', 'plus', 'profile', 'message', 'search', 'statistics', 'favorites', 'logout'].map((id) => (
        <Icon key={id} iconId={id} width="40px" height="40px" />
      ))}
    </div>
  ),
}
