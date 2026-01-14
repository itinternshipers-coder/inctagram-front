import { AddPhoto } from '@/widgets/CreatPost/CreatePostModal/AddPhoto/AddPhoto'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'

const meta = {
  title: 'widgets/CreatePost/CreatePostModal/AddPhoto',
  component: AddPhoto,
  argTypes: {},
} satisfies Meta<typeof AddPhoto>

export default meta
type Story = StoryObj<typeof meta>

// Базовое состояние
export const Default: Story = {
  args: {
    onSelectImage: action('Изображение выбрано'),
    onCloseModal: action('Модальное окно закрыто'),
  },
}

// Состояние с ошибкой валидации
export const WithError: Story = {
  args: {
    ...Default.args,
  },
}
