'use client'

import * as Dialog from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import { CloseOutlineIcon } from '@/shared/icons/svgComponents'
import { CheckBox } from '../CheckBox/CheckBox'
import { Button } from '../Button/Button'
import clsx from 'clsx'
import s from './Modal.module.scss'

export type ModalProps = {
  open: boolean
  onOpenChange: (value: boolean) => void

  title: string
  message: string | React.ReactNode

  confirmMode?: boolean // true = две кнопки, false = одна кнопка
  buttonText?: string // Текст основной кнопки
  onAction?: () => void // Callback основной кнопки

  cancelButtonText?: string // Текст кнопки отмены
  onCancel?: () => void // Callback кнопки отмены

  hasCheckbox?: boolean // Показывать чекбокс (CreatePayment)
  checkboxText?: string
  onCheckboxChange?: (checked: boolean | 'indeterminate') => void

  isActionDisabled?: boolean // Блокировка кнопки OK при неактивном чекбоксе

  style?: React.CSSProperties // Дополнительные inline-стили

  isCancelPrimary?: boolean // Делает левую кнопку основной (primary)
  actionsJustifyBetween?: boolean // justify-content: space-between
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
}: ModalProps) => {
  const [swap, setSwap] = useState(false)
  const dynamicIsCancelPrimary = swap ? !isCancelPrimary : isCancelPrimary

  // Класс контейнера кнопок:
  // 1) confirmMode = две кнопки
  // 2) hasCheckbox = чекбокс + кнопка
  // 3) иначе — одна кнопка
  const actionsClass = confirmMode
    ? clsx(s.actionsContainer, { [s.between]: actionsJustifyBetween })
    : hasCheckbox
      ? s.checkboxAndActionsContainer
      : s.actionsContainerSingle

  /**
   * Объяснение cancelVariant и actionVariant:
   *
   * - По умолчанию правая кнопка = primary, левая = secondary
   * - Но если isCancelPrimary = true:
   *    → Левая кнопка (Cancel) становится primary
   *    → Правая кнопка (Action) становится secondary
   *
   * Это позволяет гибко настраивать, какая кнопка важнее визуально.
   */
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
          </div>

          {/* --- РЕЖИМ: ДВЕ КНОПКИ --- */}
          {confirmMode ? (
            <div className={actionsClass}>
              {/* Кнопка Cancel (левая) */}
              {/* variant определяется через cancelVariant */}
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

              {/* Кнопка Action (правая) */}
              {/* variant определяется через actionVariant */}
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
            // --- РЕЖИМ: ОДНА КНОПКА или ЧЕКБОКС + КНОПКА ---
            <div className={actionsClass}>
              {/* Чекбокс при необходимости */}
              {hasCheckbox && (
                <div className={s.checkboxWrapper}>
                  <CheckBox
                    checked={!isActionDisabled} // Чекбокс управляет блокировкой кнопки OK
                    onCheckedChange={onCheckboxChange}
                    name={checkboxText}
                  />
                </div>
              )}

              {/* Единственная кнопка OK */}
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
