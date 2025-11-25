'use client'

import { Button } from '@/shared/ui/Button/Button'
import s from 'src/shared/ui/ConfirmModal/ConfirmModal.module.scss'
import React, { useEffect } from 'react'
import { Portal } from '../Portal/Portal'
import CloseOutlineIcon from '@/shared/icons/svgComponents/icons/CloseOutlineIcon'

type Props = {
  closeModal: () => void
  onConfirm: () => void
  text: string
  title: string
  openModal: boolean
}

const ConfirmModal = ({ openModal, closeModal, onConfirm, text, title }: Props) => {
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [openModal])

  if (!openModal) return null

  return (
    <Portal>
      <div className={s.overlay} onClick={closeModal}>
        <div className={s.modal} onClick={(e) => e.stopPropagation()}>
          <div className={s.modalHeader}>
            {title && <h2>{title}</h2>}
            <Button as={'button'} onClick={closeModal} className={s.closeButton}>
              <CloseOutlineIcon />
            </Button>
          </div>
          <div className={s.modalSidebarBody}>
            <p>{text}</p>
            <div className={s.modalSidebarBodyButtonBox}>
              <Button as={'button'} variant={'tertiary'} onClick={onConfirm} className={s.yesBtn}>
                Yes
              </Button>
              <Button as={'button'} variant={'primary'} onClick={closeModal} className={s.noBtn}>
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default ConfirmModal
