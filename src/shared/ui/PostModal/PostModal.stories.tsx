import { Meta, StoryFn } from '@storybook/nextjs-vite'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import React, { useState } from 'react'

import { Author, CommentType, Photo, PostDataType, PostModalProps } from './types'
import PostModal from './PostModal'

// -------------------- Моки --------------------
const mockAuthor: Author = {
  id: 'user-uuid-1',
  username: 'UserName',
  avatarUrl: 'https://via.placeholder.com/40',
}

const mockPhotos: Photo[] = [
  {
    id: 'photo-uuid-1',
    photoId: 'photo-storage-id-1',
    s3Key: 'key/1.jpg',
    url: 'https://images.unsplash.com/photo-1549419163-9524be0e704e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3',
    order: 0,
    createdAt: '2025-11-09T10:00:00.000Z',
  },
  {
    id: 'photo-uuid-2',
    photoId: 'photo-storage-id-2',
    s3Key: 'key/2.jpg',
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
        replies: [
          {
            id: 'reply-1-1',
            user: { id: 'r2', username: 'NestedUser', avatarUrl: 'https://via.placeholder.com/30' },
            text: 'Ответ на ответ — вложенный!',
            time: '30 minutes ago',
            likesCount: 2,
          },
        ],
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

const mockPostData: PostDataType = {
  id: 'post-uuid-123',
  authorId: mockAuthor.id,
  userName: mockAuthor.username,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Это демонстрационное описание.',
  createdAt: '2025-07-03T10:00:00.000Z',
  updatedAt: '2025-07-03T10:05:00.000Z',
  deletedAt: null,
  photos: mockPhotos,
  likesCount: 2243,
  comments: mockComments,
}

// -------------------- Meta --------------------
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
}
PostWithComments.storyName = '01. Post with Comments'

export const PostWithoutComments = Template.bind({})
PostWithoutComments.args = {
  postData: {
    ...mockPostData,
    comments: [],
  } as PostDataType,
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
    deletedAt: null,
    photos: [
      {
        id: 'photo-loading',
        photoId: 'loading',
        s3Key: '',
        url: 'https://via.placeholder.com/600x400?text=Loading...',
        order: 0,
        createdAt: '',
      },
    ],
    likesCount: 0,
    comments: [],
  } as PostDataType,
}
LoadingEmptyState.storyName = '03. Loading/Empty State'
