import { useGetOAuthUrlMutation } from '@/features/auth/api/auth-api'
import { useState } from 'react'

export const useOAuth = () => {
  const [getOAuthUrl] = useGetOAuthUrlMutation()
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleOAuth = async (provider: string) => {
    setLoading((prev) => ({ ...prev, [provider]: true }))

    try {
      const { data } = await getOAuthUrl({ provider })
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('OAuth error:', error)
    } finally {
      setLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  return { handleOAuth, loading }
}
