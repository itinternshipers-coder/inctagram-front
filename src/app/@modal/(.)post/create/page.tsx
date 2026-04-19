'use client'

import { CreatePostModal } from '@/features/create-post/ui/CreatePostModal/CreatePostModal'
import { useRouter } from 'next/navigation'
import s from './page.module.scss'

export default function PostModalPage() {
  const router = useRouter()

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      router.back()
    }
  }

  return (
    <div className={s.overlay} onClick={handleOverlayClick}>
      <CreatePostModal />
    </div>
  )
}
