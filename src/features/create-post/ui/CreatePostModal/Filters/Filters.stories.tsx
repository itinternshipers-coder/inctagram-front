import { Filters } from './Filters'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

// Создаем пустые изображения или с минимальными данными
const createMockFile = (name: string, size: number = 1024, type: string = 'image/jpeg'): File => {
  const blob = new Blob([''], { type })
  return new File([blob], name, {
    lastModified: Date.now(),
    type,
  })
}

// Создаем массив мок-файлов
const mockImages: File[] = [
  createMockFile('image1.jpg'),
  createMockFile('image2.png', 2048, 'image/png'),
  createMockFile('image3.jpeg', 512, 'image/jpeg'),
]

const meta = {
  title: 'widgets/CreatePost/CreatePostModal/Filters',
  component: Filters,
  argTypes: {
    onFilterApply: { action: 'filterApplied' },
    onNext: { action: 'nextClicked' },
    onBack: { action: 'backClicked' },
  },
} satisfies Meta<typeof Filters>

export default meta
type Story = StoryObj<typeof meta>

// Базовое состояние
export const Default: Story = {
  args: {
    currentStep: 'filters',
    images: mockImages, // Исправлено: передаем массив, а не массив массивов
    onFilterApply: (images) => console.log('Filter applied:', images),
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
  },
}

// Состояние с одним изображением
export const SingleImage: Story = {
  args: {
    currentStep: 'filters',
    images: [mockImages[0]], // Только первое изображение
    onFilterApply: (images) => console.log('Filter applied:', images),
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
  },
}

// Состояние с пустым массивом (если такое возможно)
export const NoImages: Story = {
  args: {
    currentStep: 'filters',
    images: [],
    onFilterApply: (images) => console.log('Filter applied:', images),
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
  },
}

// С большим количеством изображений
export const MultipleImages: Story = {
  args: {
    currentStep: 'filters',
    images: [
      ...mockImages,
      createMockFile('image4.jpg', 3072, 'image/jpeg'),
      createMockFile('image5.jpg', 4096, 'image/jpeg'),
      createMockFile('image6.jpg', 1024, 'image/jpeg'),
    ],
    onFilterApply: (images) => console.log('Filter applied:', images),
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
  },
}
