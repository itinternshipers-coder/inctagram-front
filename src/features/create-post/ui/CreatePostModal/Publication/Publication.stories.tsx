import { Publication, PhotoType } from '@/features/create-post/ui/CreatePostModal/Publication/Publication'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

// Создаем мок-данные для изображений
const createMockFile = (name: string, size: number = 1024, type: string = 'image/jpeg'): File => {
  const blob = new Blob([''], { type })
  return new File([blob], name, {
    lastModified: Date.now(),
    type,
  })
}

// Мок-данные для File[] images
const mockImages: File[] = [
  createMockFile('landscape.jpg', 102400, 'image/jpeg'),
  createMockFile('portrait.png', 204800, 'image/png'),
  createMockFile('nature.jpeg', 153600, 'image/jpeg'),
]

// Мок-данные для PhotoType[]

const meta = {
  title: 'widgets/CreatePost/CreatePostModal/Publication',
  component: Publication,
  argTypes: {
    onBack: { action: 'backClicked' },
    onNext: { action: 'nextClicked' },
    images: { control: false }, // Отключаем контроль, т.к. это File[]
    currentStep: { control: false }, // Отключаем, т.к. это фиксированное значение
  },
} satisfies Meta<typeof Publication>

export default meta
type Story = StoryObj<typeof meta>

// Базовое состояние с несколькими изображениями
export const Default: Story = {
  args: {
    currentStep: 'publication',
    images: mockImages,
    onBack: () => console.log('Back clicked'),
    onNext: () => console.log('Next clicked'),
  },
}

// Состояние с одним изображением
export const SingleImage: Story = {
  args: {
    currentStep: 'publication',
    images: [mockImages[0]],
    onBack: () => console.log('Back clicked'),
    onNext: () => console.log('Next clicked'),
  },
}

// Состояние без изображений
export const NoImages: Story = {
  args: {
    currentStep: 'publication',
    images: [],
    onBack: () => console.log('Back clicked'),
    onNext: () => console.log('Next clicked'),
  },
}
