import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProfileHeader } from './ProfileHeader'
import { mockMyProfile, mockFriendProfile } from '@/shared/mocks/profile'

const meta: Meta<typeof ProfileHeader> = {
  title: 'Features/Profile/ProfileHeader',
  component: ProfileHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProfileHeader>

export const MyProfileOwnerLoggedIn: Story = {
  args: {
    profile: { ...mockMyProfile, followingCount: 2218, followersCount: 2358 },
    postsCount: 10,
    isOwner: true,
    isLoggedIn: true,
  },
}

export const FriendProfileFollowing: Story = {
  args: {
    profile: { ...mockFriendProfile, followingCount: 152, followersCount: 903, isFollowed: true },
    postsCount: 5,
    isOwner: false,
    isLoggedIn: true,
  },
}

export const FriendProfileNotFollowing: Story = {
  args: {
    profile: { ...mockFriendProfile, followingCount: 152, followersCount: 902, isFollowed: false },
    postsCount: 5,
    isOwner: false,
    isLoggedIn: true,
  },
}

export const FriendProfileUnauthorized: Story = {
  args: {
    profile: { ...mockFriendProfile, followingCount: 152, followersCount: 902, isFollowed: false },
    postsCount: 5,
    isOwner: false,
    isLoggedIn: false,
  },
}
