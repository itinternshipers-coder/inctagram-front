import type { Post } from '@/entities/post/model'
import { API_ENDPOINTS } from '@/shared/api/endpoints'

export type MainPageData = { ok: true; usersCount: number; recentPosts: Post[] } | { ok: false }

export async function getMainPageData(): Promise<MainPageData> {
  const baseUrl = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_BASE_API_URL
  const endpoint = API_ENDPOINTS.POSTS.PUBLIC_STATS

  try {
    const res = await fetch(`${baseUrl}${endpoint}`)

    if (!res.ok) {
      const txt = await res.text()
      console.error(`Main page data fetch failed: ${res.status} ${res.statusText}`, txt)
      return { ok: false }
    }

    const data = await res.json()
    const recentPosts: Post[] = (data.recentPosts || []).slice(0, 4)

    return {
      ok: true,
      usersCount: data.usersCount,
      recentPosts,
    }
  } catch (e) {
    console.error('FETCH ERROR:', e)
    return { ok: false }
  }
}
