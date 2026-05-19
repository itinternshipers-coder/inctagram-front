import { Meta, StoryFn } from '@storybook/nextjs-vite'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import React, { useState } from 'react'
import PostModal from './PostModal'
import { Author, PhotoType, PostModalProps, UserPostType } from '@/features/post/model/type'

const mockAuthor: Author = {
  id: 'user-uuid-1',
  username: 'UserName',
  avatarUrl: 'https://via.placeholder.com/40',
}

const mockPhotos: PhotoType[] = [
  {
    photoId: 'photo-storage-id-1',
    url: 'https://images.unsplash.com/photo-1549419163-9524be0e704e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3',
    order: 0,
    createdAt: '2025-11-09T10:00:00.000Z',
  },
  {
    photoId: 'photo-storage-id-2',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cfab7388?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3',
    order: 1,
    createdAt: '2025-11-09T10:01:00.000Z',
  },
]

const mockPostData: UserPostType = {
  id: 'post-uuid-123',
  authorId: mockAuthor.id,
  author: {
    id: mockAuthor.id,
    username: mockAuthor.username,
  },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Это демонстрационное описание.',
  createdAt: '2025-07-03T10:00:00.000Z',
  updatedAt: '2025-07-03T10:05:00.000Z',
  photos: mockPhotos,
}

const meta: Meta<PostModalProps> = {
  title: 'Components/PostModal',
  component: PostModal,
  args: {
    postData: mockPostData,
    open: true,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#121212' }],
    },
  },
}

export default meta

const Template: StoryFn<PostModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(args.open)

  return (
    <Provider store={store}>
      <div style={{ height: '500px' }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none' }}
        >
          Open Modal
        </button>
        <PostModal {...args} open={isOpen} onOpenChange={setIsOpen} />
      </div>
    </Provider>
  )
}

export const PostWithComments = Template.bind({})
PostWithComments.args = {
  postData: mockPostData,
}
PostWithComments.storyName = '01. Post with Comments'

export const PostWithoutComments = Template.bind({})
PostWithoutComments.args = {
  postData: mockPostData,
}
PostWithoutComments.storyName = '02. Post without Comments'

export const LoadingEmptyState = Template.bind({})
LoadingEmptyState.args = {
  postData: {
    id: 'loading-id',
    authorId: '',
    author: {
      id: '',
      username: 'Loading...',
    },
    description: '',
    createdAt: '',
    updatedAt: '',
    photos: [
      {
        photoId: 'loading',
        url: 'https://via.placeholder.com/600x400?text=Loading...',
        order: 0,
        createdAt: '',
      },
    ],
  } as UserPostType,
}
LoadingEmptyState.storyName = '03. Loading/Empty State'
