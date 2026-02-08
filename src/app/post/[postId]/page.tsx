import s from './page.module.scss'
import { PostView } from '@/shared/ui/PostView/PostView'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ postId: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { postId } = await params

  return (
    <div className={s.postModal}>
      <Link href={'/'} className={s.linkBack}>
        Back
      </Link>
      <PostView postId={postId} />
    </div>
  )
}
