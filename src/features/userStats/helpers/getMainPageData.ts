import { API_ENDPOINTS } from '@/shared/api/endpoints'

export async function getMainPageData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL
  const endpoint = API_ENDPOINTS.POSTS.PUBLIC_STATS

  try {
    const res = await fetch(`${baseUrl}${endpoint}`)

    if (!res.ok) {
      const txt = await res.text()
      console.error('ERROR RESPONSE TEXT:', txt)
      throw new Error(`Failed to load main page data: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const recentPosts = data.recentPosts || []
    const latestFourPosts = recentPosts.slice(0, 4)

    return {
      usersCount: data.usersCount,
      recentPosts: latestFourPosts,
    }
  } catch (e) {
    console.error('FETCH ERROR:', e)
    throw e
  }
}
