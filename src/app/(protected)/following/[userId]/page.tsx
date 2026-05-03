import { notFound } from 'next/navigation'
import { FollowsList } from '@/features/following/ui/FollowsList/FollowsList'
import s from './page.module.scss'

export default async function FollowingPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  if (!userId || userId === 'undefined') notFound()

  return (
    <section className={s.page}>
      <FollowsList userId={userId} kind="following" />
    </section>
  )
}
