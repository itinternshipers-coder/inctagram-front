'use client'

import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { FollowsList } from './FollowsList'
import s from './FollowsModal.module.scss'
import type { FollowsKind } from './lib/useFollowsInfinite'

type Props = {
  userId: string
  kind: FollowsKind
}

export const FollowsModal = ({ userId, kind }: Props) => {
  const router = useRouter()

  return (
    <Dialog.Root
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) router.back()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <div className={s.container}>
          <Dialog.Content className={s.content} aria-describedby={undefined}>
            <Dialog.Title className={s.visuallyHidden}>{kind === 'followers' ? 'Followers' : 'Following'}</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className={s.closeBtn} aria-label="Close">
                <CloseOutlineIcon />
              </button>
            </Dialog.Close>
            <FollowsList userId={userId} kind={kind} />
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
