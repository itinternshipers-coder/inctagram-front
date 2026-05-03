import { notFound } from 'next/navigation'
import { FollowsModal } from '@/features/following/ui/FollowsList/FollowsModal'

export default async function FollowingInterceptModal({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  if (!userId || userId === 'undefined') notFound()

  return <FollowsModal userId={userId} kind="following" />
}
