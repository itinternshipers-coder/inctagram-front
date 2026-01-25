import { Cropping } from './Cropping'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta = {
  title: 'widgets/CreatePost/CreatePostModal/Cropping',
  component: Cropping,
  argTypes: {},
} satisfies Meta<typeof Cropping>

export default meta
type Story = StoryObj<typeof meta>

// Базовое состояние
export const Default: Story = {
  args: {
    currentStep: 'cropping',
    images: [],
  },
}

// Состояние с ошибкой валидации
export const WithError: Story = {
  args: {
    ...Default.args,
  },
}
