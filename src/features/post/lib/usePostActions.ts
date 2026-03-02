import { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export const usePostActions = () => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleToggleSubscribe = () => setIsSubscribed((prev) => !prev)
  const handleShare = async () => {
    const url = `${window.location.origin}${pathname}?${searchParams.toString()}`
    await navigator.clipboard.writeText(url)
  }

  return { isSubscribed, handleToggleSubscribe, handleShare }
}
