'use client'

import * as Dialog from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import { CloseOutlineIcon } from '../../icons'
import { CheckBox } from '../CheckBox/CheckBox'
import { Button } from '../Button/Button'
import clsx from 'clsx'
import s from './Modal.module.scss'

export type ModalProps = {
  open: boolean
  onOpenChange: (value: boolean) => void

  title: string
  message: string | React.ReactNode

  confirmMode?: boolean
  buttonText?: string
  onAction?: () => void

  cancelButtonText?: string
  onCancel?: () => void

  hasCheckbox?: boolean
  checkboxText?: string
  onCheckboxChange?: (checked: boolean | 'indeterminate') => void

  isActionDisabled?: boolean

  style?: React.CSSProperties

  isCancelPrimary?: boolean
  actionsJustifyBetween?: boolean

  children?: React.ReactNode
}

export const Modal = ({
  open,
  onOpenChange,
  title,
  message,
  confirmMode = false,
  buttonText = confirmMode ? 'Yes' : 'OK',
  onAction,
  cancelButtonText = 'No',
  onCancel,
  hasCheckbox = false,
  checkboxText = 'I agree',
  isActionDisabled = false,
  onCheckboxChange,
  actionsJustifyBetween = false,
  isCancelPrimary = false,
  style,
  children,
}: ModalProps) => {
  const [swap, setSwap] = useState(false)
  const dynamicIsCancelPrimary = swap ? !isCancelPrimary : isCancelPrimary

  const actionsClass = confirmMode
    ? clsx(s.actionsContainer, { [s.between]: actionsJustifyBetween })
    : hasCheckbox
      ? s.checkboxAndActionsContainer
      : s.actionsContainerSingle

  const cancelVariant = isCancelPrimary || dynamicIsCancelPrimary ? 'primary' : 'secondary'
  const actionVariant = isCancelPrimary || dynamicIsCancelPrimary ? 'secondary' : 'primary'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />

        <Dialog.Content className={s.content} style={style}>
          <div className={s.header}>
            <Dialog.Title className={s.title}>{title}</Dialog.Title>

            <Dialog.Close asChild className={s.closeBtn}>
              <CloseOutlineIcon />
            </Dialog.Close>
          </div>

          <div className={s.messageContent}>
            <Dialog.Description className={s.message}>{message}</Dialog.Description>
            {children && <div className={s.childrenContent}>{children}</div>}
          </div>

          {confirmMode ? (
            <div className={actionsClass}>
              <Dialog.Close asChild>
                <Button
                  onMouseEnter={() => setSwap(true)}
                  onMouseLeave={() => setSwap(false)}
                  className={`${cancelVariant === 'primary' ? s.primary : s.secondary}`}
                  onClick={onCancel}
                  variant={cancelVariant}
                >
                  {cancelButtonText}
                </Button>
              </Dialog.Close>

              <Dialog.Close asChild>
                <Button
                  className={`${actionVariant === 'primary' ? s.primary : s.secondary}`}
                  onClick={onAction}
                  variant={actionVariant}
                >
                  {buttonText}
                </Button>
              </Dialog.Close>
            </div>
          ) : (
            <div className={actionsClass}>
              {hasCheckbox && (
                <div className={s.checkboxWrapper}>
                  <CheckBox
                    checked={!isActionDisabled}
                    onCheckedChange={onCheckboxChange}
                    name={checkboxText}
                  />
                </div>
              )}

              <Dialog.Close asChild>
                <Button
                  className={`${s.actionBtn} ${s.primary}`}
                  onClick={onAction}
                  variant="primary"
                  disabled={isActionDisabled}
                  fullWidth={!confirmMode && !hasCheckbox}
                >
                  {buttonText}
                </Button>
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
