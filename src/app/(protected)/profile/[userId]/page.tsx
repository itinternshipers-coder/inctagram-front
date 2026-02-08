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

  if (!profile) {
    console.log('Profile not found for userId:', userId)
    notFound()
  }

  return (
    <div>
      <div>
        <div>
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt={profile.userName} />
          ) : (
            <div className="avatar-placeholder">{profile.userName?.charAt(0)?.toUpperCase() || 'Photo is missing'}</div>
          )}
        </div>

        <div>
          <h1>{`UserName: ${profile.username}` || 'Unknown User'}</h1>
          <h1>{`UserID: ${profile.userId}` || 'Unknown ID'}</h1>

          <div>
            <div>
              <strong>{profile.postsCount || 0}</strong>
              <span> posts</span>
            </div>
            <div>
              <strong>{profile.followersCount || 0}</strong>
              <span> followers</span>
            </div>
            <div>
              <strong>{profile.followingCount || 0}</strong>
              <span> following</span>
            </div>
          </div>

          {profile.description && <p className="profile-description">{profile.description}</p>}
        </div>
      </div>

      <div>
        {posts.length > 0 ? (
          posts.map((post: Post) => (
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
