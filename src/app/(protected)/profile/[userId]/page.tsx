import { UserPostsList } from '@/features/profile/ui/UserPostsList/UserPostsList'
import { fetchProfileData } from '@/shared/lib/server/fetch-profile-data'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button/Button'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  if (!userId || userId === 'undefined') {
    console.error('Invalid userId:', userId)
    notFound()
  }

  const { profile, posts } = await fetchProfileData(userId)

  if (!profile) {
    console.log('Profile not found for userId:', userId)
    notFound()
  }

  const avatarUrl = profile.avatar?.[0]?.url

  return (
    <div>
      <Link href={ROUTES.DYNAMIC.SETTINGS_TAB('')}>
        <Button>Profile Settings</Button>
      </Link>
      <div>
        <div>
          {avatarUrl ? (
            <Image src={avatarUrl} alt={profile.username || 'User avatar'} width={192} height={192} />
          ) : (
            <div>{profile.username?.charAt(0)?.toUpperCase() || 'Photo is missing'}</div>
          )}
        </div>

        <div>
          <h1>{`UserName: ${profile?.firstName} ${profile?.lastName}` || 'Unknown User'}</h1>
          <h2>{`UserID: ${profile.userId}` || 'Unknown ID'}</h2>

          <div>
            <div>
              <strong>{profile.country || 'country: not specified'}</strong>
            </div>
            <div>
              <strong>{profile.city || 'city: not specified'}</strong>
            </div>
          </div>
        </div>
      </div>

      <UserPostsList userId={userId} initialPosts={posts?.items ?? []} initialTotalCount={posts?.totalCount ?? 0} />
    </div>
  )
}
