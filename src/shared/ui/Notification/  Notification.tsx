import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
// Импортируем стили как модуль
import styles from './Notification.module.css'

type MessageType = 'success' | 'error' | 'info'

type NotificationProps = {
  /** Управляет отображением диалога */
  open: boolean
  /** Функция-обработчик закрытия */
  onOpenChange: (open: boolean) => void
  /** Тип сообщения, который определяет цвет */
  type: MessageType
  /** Заголовок сообщения */
  title: string
  /** Основной текст сообщения */
  message: string
  /** Текст на кнопке действия (по умолчанию 'OK') */
  buttonText?: string
}

export const Notification: React.FC<NotificationProps> = ({
  open,
  onOpenChange,
  type,
  title,
  message,
  buttonText = 'OK', // Значение по умолчанию
}) => {
  // Класс для типа сообщения, который будет добавлен к Title и Button
  const typeClass = styles[type]

  // Комбинируем общие и специфические для типа классы
  const titleClasses = `${styles.Title} ${typeClass}`
  const buttonClasses = `${styles.Button} ${typeClass}`

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay (Фон) */}
        <Dialog.Overlay className={styles.Overlay}>
          {/* Content (Само окно) */}
          <Dialog.Content className={styles.Content}>
            {/* Заголовок с динамическим классом для цвета */}
            <Dialog.Title className={titleClasses}>{title}</Dialog.Title>

            {/* Сообщение (Описание) */}
            <Dialog.Description className={styles.Description}>{message}</Dialog.Description>

            {/* Контейнер для кнопки */}
            <div className={styles.Actions}>
              {/* Кнопка действия, которая закрывает диалог */}
              <Dialog.Close asChild>
                <button
                  className={buttonClasses}
                  // onClick={() => onOpenChange(false)} // Явно вызываем onOpenChange
                >
                  {buttonText}
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
