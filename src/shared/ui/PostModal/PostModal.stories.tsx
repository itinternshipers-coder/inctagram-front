import { Meta, StoryFn } from '@storybook/nextjs-vite'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import React, { useState } from 'react'

import PostModal, { UserPostType, CommentType, Author, PhotoType, PostModalProps } from './PostModal'

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

const mockComments: CommentType[] = [
  {
    id: 'comment-uuid-1',
    user: { id: 'c1', username: 'Commenter1', avatarUrl: 'https://via.placeholder.com/30' },
    text: 'Это комментарий с ответами!',
    time: '2 hours ago',
    likesCount: 21,
    replies: [
      {
        id: 'reply-1',
        user: { id: 'r1', username: 'ReplyGuy', avatarUrl: 'https://via.placeholder.com/30' },
        text: 'Это ответ на комментарий!',
        time: '1 hour ago',
        likesCount: 5,
      },
    ],
  },
  {
    id: 'comment-uuid-2',
    user: { id: 'c2', username: 'Commenter2', avatarUrl: 'https://via.placeholder.com/30' },
    text: 'Без ответов.',
    time: '1 hour ago',
    likesCount: 20,
  },
]

const mockPostData: UserPostType = {
  id: 'post-uuid-123',
  authorId: mockAuthor.id,
  userName: mockAuthor.username,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Это демонстрационное описание.',
  createdAt: '2025-07-03T10:00:00.000Z',
  updatedAt: '2025-07-03T10:05:00.000Z',
  photos: mockPhotos,
}

// -------------------- Meta --------------------
const meta: Meta<PostModalProps> = {
  title: 'Components/PostModal',
  component: PostModal,
  args: {
    postData: mockPostData,
    comments: mockComments,
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

// -------------------- Template --------------------
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

// -------------------- Stories --------------------
export const PostWithComments = Template.bind({})
PostWithComments.args = {
  postData: mockPostData,
  comments: mockComments,
}
PostWithComments.storyName = '01. Post with Comments'

export const PostWithoutComments = Template.bind({})
PostWithoutComments.args = {
  postData: mockPostData,
  comments: [],
}
PostWithoutComments.storyName = '02. Post without Comments'

export const LoadingEmptyState = Template.bind({})
LoadingEmptyState.args = {
  postData: {
    id: 'loading-id',
    authorId: '',
    userName: 'Loading...',
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
  comments: [],
}
LoadingEmptyState.storyName = '03. Loading/Empty State'
