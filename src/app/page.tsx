import { PostList } from '@/entities/post/ui/PostList/PostList'
import { getMainPageData } from '@/features/userStats/helpers/getMainPageData'
import { MainPageError } from '@/features/userStats/ui/MainPageError/MainPageError'
import { RegisteredUsers } from '@/features/userStats/ui/RegisteredUsers/RegisteredUsers'

export default async function RootPage() {
  const data = await getMainPageData()

  if (!data.ok) {
    return <MainPageError />
  }

  return (
    <div>
      <RegisteredUsers count={data.usersCount} />
      <PostList posts={data.recentPosts} />
    </div>
  )
}
