import PostList from '@/entities/post/ui/PostList/PostList'
import { getMainPageData } from '@/features/userStats/helpers/getMainPageData'
import { RegisteredUsers } from '@/features/userStats/ui/RegisteredUsers/RegisteredUsers'

export default async function RootPage() {
  const { usersCount, recentPosts } = await getMainPageData()

  return (
    <div>
      <RegisteredUsers count={usersCount} />
      <PostList posts={recentPosts} />
    </div>
  )
}
