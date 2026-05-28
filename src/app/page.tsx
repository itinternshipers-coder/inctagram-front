import { PostList } from '@/entities/post/ui/PostList/PostList'
import { getMainPageData } from '@/features/userStats/helpers/getMainPageData'
import { MainPageError } from '@/features/userStats/ui/MainPageError/MainPageError'
import { RegisteredUsers } from '@/features/userStats/ui/RegisteredUsers/RegisteredUsers'
import { HomeContent } from './HomeContent' // клиентский компонент

export default async function RootPage() {
  const data = await getMainPageData()
  if (!data.ok) return <MainPageError />

  const guestContent = (
    <>
      <RegisteredUsers count={data.usersCount} />
      <PostList posts={data.recentPosts} />
    </>
  )

  return <HomeContent guestContent={guestContent} />
}
