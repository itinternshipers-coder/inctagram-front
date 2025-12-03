import { Meta, StoryFn } from '@storybook/nextjs-vite'
import { Author, CommentType, Photo, PostDataType, PostModalProps } from './types'
import PostModal from './PostModal'
import React, { useState } from 'react'
// import s from './PostModal.module.scss'
// --- Моковые Данные (Соответствуют PostDataType) ---
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
    url: 'https://images.unsplash.com/photo-1549419163-9524be0e704e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Реалистичное фото
    order: 0,
    createdAt: '2025-11-09T10:00:00.000Z',
  },
  {
    id: 'photo-uuid-2',
    photoId: 'photo-storage-id-2',
    s3Key: 'key/2.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cfab7388?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Второе фото
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
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Это демонстрационное описание, которое будет видно как первый "комментарий".',
  createdAt: '2025-07-03T10:00:00.000Z',
  updatedAt: '2025-07-03T10:05:00.000Z',
  deletedAt: null,
  photos: mockPhotos,
  author: mockAuthor,
  likesCount: '2 243',
  comments: mockComments,
}
// ---------------------------------------------

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
    <div style={{ height: '500px' }}>
      {/* Кнопка для открытия модального окна в Storybook */}
      <button
        onClick={() => setIsOpen(true)}
        style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none' }}
      >
        Open Modal
      </button>
      <PostModal {...args} open={isOpen} onOpenChange={setIsOpen} />
    </div>
  )
}

// --- Варианты Историй ---

export const PostWithComments = Template.bind({})
PostWithComments.args = {
  postData: mockPostData,
}
PostWithComments.storyName = '01. Post with Comments'

export const PostWithoutComments = Template.bind({})
PostWithoutComments.args = {
  postData: {
    ...mockPostData,
    comments: [], // Пустой массив комментариев
  } as PostDataType,
}
PostWithoutComments.storyName = '02. Post without Comments'

export const LoadingEmptyState = Template.bind({})
LoadingEmptyState.args = {
  postData: {
    id: 'loading-id',
    authorId: '',
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
    author: { id: '', username: 'Loading...', avatarUrl: 'https://via.placeholder.com/40' },
    likesCount: '...',
    comments: [],
  } as PostDataType,
}
LoadingEmptyState.storyName = '03. Loading/Empty State'
