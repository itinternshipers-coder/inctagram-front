import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PostCard } from './PostCard'
import { PostPhoto } from '../../model'

// Мок-данные
const mockPhotos: PostPhoto[] = [
  {
    id: '1',
    photoId: 'p1',
    s3Key: 'posts/1/1.jpg',
    url: 'https://placehold.co/600x600.png?text=PostPhoto',
    order: 1,
    createdAt: '2025-12-14T10:00:00Z',
  },
  {
    id: '2',
    photoId: 'p2',
    s3Key: 'posts/1/2.jpg',
    url: 'https://placehold.co/600x600/orange/.png?text=PostPhoto',
    order: 2,
    createdAt: '2025-12-14T10:00:00Z',
  },
  {
    id: '3',
    photoId: 'p3',
    s3Key: 'posts/1/3.jpg',
    url: 'https://placehold.co/600x600/blue/.png?text=PostPhoto',
    order: 3,
    createdAt: '2025-12-14T10:00:00Z',
  },
]

const mockUserImage = 'https://placehold.co/100?text=User'

const meta = {
  title: 'Entities/Post/PostCard',
  component: PostCard,
  argTypes: {},
} satisfies Meta<typeof PostCard>

export default meta
type Story = StoryObj<typeof meta>

export const SinglePhoto: Story = {
  args: {
    photos: [mockPhotos[0]],
    userProfileImage: mockUserImage,
    userName: 'Alex',
    timeAgo: '22 min',
    description: 'A post with a single image. Short description.',
  },
}

export const MultiplePhotos: Story = {
  args: {
    photos: mockPhotos,
    userProfileImage: mockUserImage,
    userName: 'Sam',
    timeAgo: '1 hour',
    description:
      'A post with multiple images. This description is long enough to trigger the "Show more" button, so you can test both collapsed and expanded states.',
  },
}

export const LongTextCollapsed: Story = {
  args: {
    photos: [mockPhotos[0]],
    userProfileImage: mockUserImage,
    userName: 'Taylor',
    timeAgo: '5 min',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
}
