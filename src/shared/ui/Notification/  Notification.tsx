'use client'

import * as Dialog from '@radix-ui/react-dialog'
import styles from './Notification.module.scss'
import React from 'react'
import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import clsx from 'clsx'

export type NotificationProps = {
  open: boolean
  onOpenChange: (value: boolean) => void
  title: string
  message: string
  buttonText?: string
}

export const Notification = ({ open, onOpenChange, title, message, buttonText = 'OK' }: NotificationProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>

            <Dialog.Close asChild className={styles.closeBtn}>
              <CloseOutlineIcon />
            </Dialog.Close>
          </div>

          <Dialog.Description className={styles.message}>{message}</Dialog.Description>

          <Dialog.Close asChild>
            <button className={styles.actionBtn}>{buttonText}</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
