import { Profile } from '@/features/profile/model/type'
import { EndpointHelpers } from '@/shared/api/endpoints'
import { normalizeError } from '@/shared/api/error-utils'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL

export async function fetchProfileData(userId: string) {
  if (!userId) {
    console.warn('Invalid or missing userId provided to fetchProfileData:', userId)
    return { profile: null }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const profileRes = await fetch(`${BASE_URL}${EndpointHelpers.profile.byId(userId)}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    })

    clearTimeout(timeoutId)

    if (profileRes.status === 404) {
      return { profile: null }
    }

    if (!profileRes.ok) {
      console.error(`Profile fetch failed with status: ${profileRes.status}`)
      return { profile: null }
    }

    const profile = (await profileRes.json()) as Profile['response']

    return { profile }
  } catch (error) {
    const normalizedError = normalizeError(error)
    console.error('Unexpected error in fetchProfileData:', normalizedError)

    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Profile data fetch was aborted (timeout)')
    }

    return { profile: null }
  }
}
