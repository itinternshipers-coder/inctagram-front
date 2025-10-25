import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import '../../../styles/base/_variables.scss'
import Tabs from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    tabs: { control: false },
    defaultActiveIndex: { control: 'number' },
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

// История с полным набором состояний
export const AllStates: Story = {
  args: {
    tabs: [
      {
        label: 'Default',
        content: <p>Content for the default tab.</p>,
      },
      {
        label: 'Active',
        content: <p>Content for the active tab.</p>,
      },
      {
        label: 'Hover',
        content: <p>Content for the hover tab.</p>,
      },
      {
        label: 'Focus',
        content: <p>Content for the focus tab.</p>,
      },
      {
        label: 'Disabled',
        content: <p>Content for the disabled tab.</p>,
        disabled: true,
      },
    ],
    defaultActiveIndex: 0,
  },
}

// История с обычным использованием
export const DefaultUsage: Story = {
  args: {
    tabs: [
      {
        label: 'Profile',
        content: <div>Profile settings go here.</div>,
      },
      {
        label: 'Security',
        content: <div>Security settings go here.</div>,
      },
      {
        label: 'Notifications',
        content: <div>Notification preferences go here.</div>,
      },
    ],
    defaultActiveIndex: 0,
  },
}
