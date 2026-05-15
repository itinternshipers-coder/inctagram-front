import { GetPosts } from '@/entities/post/model'
import { Profile } from '@/features/profile/model/type'
import { EndpointHelpers } from '@/shared/api/endpoints'
import { normalizeError } from '@/shared/api/error-utils'

const BASE_URL = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_BASE_API_URL

export async function fetchProfileData(userId: string) {
  if (!userId) {
    console.warn('Invalid or missing userId provided to fetchProfileData:', userId)
    return { profile: null, posts: null }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const [profileRes, postsRes, followersRes, followingRes] = await Promise.all([
      fetch(`${BASE_URL}${EndpointHelpers.profile.byId(userId)}`, {
        signal: controller.signal,
        next: { revalidate: 60 },
      }),
      fetch(`${BASE_URL}${EndpointHelpers.posts.byUser(userId)}?pageSize=8`, {
        signal: controller.signal,
        next: { revalidate: 60 },
      }),
      fetch(`${BASE_URL}${EndpointHelpers.profile.followers(userId)}?page=1&pageSize=1`, {
        signal: controller.signal,
        next: { revalidate: 60 },
      }),
      fetch(`${BASE_URL}${EndpointHelpers.profile.following(userId)}?page=1&pageSize=1`, {
        signal: controller.signal,
        next: { revalidate: 60 },
      }),
    ])

    clearTimeout(timeoutId)

    if (profileRes.status === 404) {
      return { profile: null, posts: null, followersTotalCount: 0, followingTotalCount: 0 }
    }

    if (!profileRes.ok) {
      console.error(`Profile fetch failed with status: ${profileRes.status}`)
      return { profile: null, posts: null, followersTotalCount: 0, followingTotalCount: 0 }
    }

    const profile = (await profileRes.json()) as Profile['response']

    let posts = null
    if (postsRes.ok) {
      try {
        posts = (await postsRes.json()) as GetPosts['response']
      } catch (e) {
        console.warn('Failed to parse posts response:', e)
      }
    }

    const readTotalCount = async (res: Response, label: string): Promise<number> => {
      if (!res.ok) return 0
      try {
        const data = (await res.json()) as { totalCount?: number }
        return data.totalCount ?? 0
      } catch (e) {
        console.warn(`Failed to parse ${label} response:`, e)
        return 0
      }
    }

    const [followersTotalCount, followingTotalCount] = await Promise.all([
      readTotalCount(followersRes, 'followers'),
      readTotalCount(followingRes, 'following'),
    ])

    return {
      profile,
      posts,
      followersTotalCount,
      followingTotalCount,
    }
  } catch (error) {
    const normalizedError = normalizeError(error)
    console.error('Unexpected error in fetchProfileData:', normalizedError)

    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Profile data fetch was aborted (timeout)')
    }

    return {
      profile: null,
      posts: null,
      followersTotalCount: 0,
      followingTotalCount: 0,
    }
  }
}
