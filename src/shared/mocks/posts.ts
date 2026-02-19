import { Post, PostPhoto, GetPosts } from '@/entities/post/model'

export const mockPostPhotos: PostPhoto[] = [
  {
    id: 'photo1',
    photoId: 'p1',
    s3Key: 'posts/123/photo1.jpg',
    url: 'https://placehold.co/600x400/ff69b4/ffffff?text=Post+1',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'photo2',
    photoId: 'p2',
    s3Key: 'posts/123/photo2.jpg',
    url: 'https://placehold.co/600x400/4caf50/ffffff?text=Post+2',
    order: 2,
    createdAt: new Date().toISOString(),
  },
]

export const mockPosts: Post[] = [
  {
    id: 'post1',
    authorId: '123',
    description: 'Beautiful sunset at the beach! 🌅',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    deletedAt: null,
    photos: [mockPostPhotos[0]],
  },
  {
    id: 'post2',
    authorId: '123',
    description: 'My new pet is so cute! 🐱',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    deletedAt: null,
    photos: [mockPostPhotos[1]],
  },
  {
    id: 'post3',
    authorId: '456',
    description: 'Check out this amazing view!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    photos: [
      {
        id: 'photo3',
        photoId: 'p3',
        s3Key: 'posts/456/photo3.jpg',
        url: 'https://placehold.co/600x400/2196f3/ffffff?text=View',
        order: 1,
        createdAt: new Date().toISOString(),
      },
    ],
  },
]

export const mockPostsResponse: GetPosts['response'] = {
  items: mockPosts,
  pageSize: 10,
  totalCount: 3,
}
