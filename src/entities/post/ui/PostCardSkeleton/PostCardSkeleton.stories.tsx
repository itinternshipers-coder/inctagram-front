import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PostCardSkeleton } from './PostCardSkeleton'

const meta: Meta<typeof PostCardSkeleton> = {
  title: 'Entities/Post/PostCardSkeleton',
  component: PostCardSkeleton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--background)' },
        { name: 'dark', value: 'var(--background)' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'
      document.documentElement.setAttribute('data-theme', theme)
      return (
        <div style={{ padding: '24px', width: '100vw' }}>
          <Story />
        </div>
      )
    },
  ],
}

export default meta

type Story = StoryObj<typeof PostCardSkeleton>

export const Light: Story = {
  globals: { theme: 'light' },
}

export const Dark: Story = {
  globals: { theme: 'dark' },
}
