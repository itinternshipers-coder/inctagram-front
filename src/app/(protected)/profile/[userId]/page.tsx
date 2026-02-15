import { Post } from '@/entities/post/model'
import { fetchProfileData } from '@/shared/lib/server/fetch-profile-data'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  if (!userId || userId === 'undefined') {
    console.error('Invalid userId:', userId)
    notFound()
  }

  const { profile, posts } = await fetchProfileData(userId)
  const postsItems = posts?.items || []
  if (!profile) {
    console.log('Profile not found for userId:', userId)
    notFound()
  }

  const avatarUrl = profile.avatar?.[0]?.url
  return (
    <div>
      <div>
        <div>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={profile.username || 'User avatar'}
              width={192}
              height={192}
            />
          ) : (
            <div>
              {profile.username?.charAt(0)?.toUpperCase() || 'Photo is missing'}
            </div>
          )}
        </div>

        <div>
          <h1>{`UserName: ${profile?.firstName } ${profile?.lastName}` || 'Unknown User'}</h1>
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

      <div>
        {postsItems.length > 0 ? (
          postsItems.map((post: Post) => (
            <div key={post.id}>
              {post.photos?.[0]?.url ? (
                <img src={post.photos[0].url} alt={post.description || 'Post'} />
              ) : (
                <div>
                  <span>{post.description?.substring(0, 50) || 'No description'}...</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  )
}
