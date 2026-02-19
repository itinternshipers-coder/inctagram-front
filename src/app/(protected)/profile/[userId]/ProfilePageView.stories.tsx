import { mockPosts } from '@/shared/mocks'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProfilePageView } from './ProfilePageView'
import { mockMyProfile, mockFriendProfile} from '@/shared/mocks/profile'
import { ProfileLayoutDecorator } from '.storybook/decorators/ProfileLayoutDecorator'


const meta: Meta<typeof ProfilePageView> = {
  title: 'Pages/ProfilePage',
  component: ProfilePageView,
  decorators: [ProfileLayoutDecorator],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof ProfilePageView>

export const MyProfile: Story = {
  args: {
    profile: mockMyProfile,
    posts: mockPosts,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/profile/123',
        query: { userId: '123' },
      },
    },
  },
}

export const FriendProfile: Story = {
  args: {
    profile: mockFriendProfile,
    posts: mockPosts,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/profile/456',
        query: { userId: '456' },
      },
    },
  },
}
