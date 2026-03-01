import { http, HttpResponse } from 'msw'
import { mockPostsResponse } from '@/shared/mocks/posts'

export const handlers = [
  http.get('/api/v1/posts/user/:userId', () => {
    return HttpResponse.json(mockPostsResponse)
  }),
  // другие ручки по мере необходимости
]
