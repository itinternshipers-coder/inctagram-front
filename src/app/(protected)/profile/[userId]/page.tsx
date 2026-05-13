import { notFound } from 'next/navigation'
import { fetchProfileData } from '@/shared/lib/server/fetch-profile-data'
import { ProfilePageView } from './ProfilePageView'

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  if (!userId || userId === 'undefined') notFound()

  const { profile, posts, followersTotalCount, followingTotalCount } = await fetchProfileData(userId)
  if (!profile) notFound()

  return (
    <ProfilePageView
      profile={profile}
      posts={posts?.items || []}
      postsTotalCount={posts?.totalCount ?? 0}
      followersTotalCount={followersTotalCount}
      followingTotalCount={followingTotalCount}
      userId={userId}
    />
  )
}
