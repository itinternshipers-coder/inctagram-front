import { Profile, Avatar } from '@/features/profile/model/type'

export const mockAvatar: Avatar = {
  userId: '123',
  url: 'https://placehold.co/192',
  width: 192,
  height: 192,
}

export const mockMyProfile: Profile['response'] = {
  userId: '123',
  username: 'john_doe',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  country: 'USA',
  city: 'New York',
  aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  avatar: [mockAvatar],
}

export const mockFriendProfile: Profile['response'] = {
  userId: '456',
  username: 'jane_smith',
  firstName: 'Jane',
  lastName: 'Smith',
  dateOfBirth: '1992-02-02',
  country: 'Canada',
  city: 'Toronto',
  aboutMe: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  avatar: [{
    userId: '456',
    url: 'https://placehold.co/192/ff69b4',
    width: 192,
    height: 192,
  }],
}

export const mockProfileWithoutAvatar: Profile['response'] = {
  userId: '789',
  username: 'no_avatar_user',
  firstName: 'No',
  lastName: 'Avatar',
  dateOfBirth: '1995-05-05',
  country: 'UK',
  city: 'London',
  aboutMe: 'I have no avatar.',
  avatar: undefined,
}
