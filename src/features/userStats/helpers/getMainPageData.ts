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

    return res.json()
  } catch (e) {
    console.error('FETCH ERROR:', e)
    throw e
  }
}
