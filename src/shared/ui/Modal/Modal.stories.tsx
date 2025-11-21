import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Modal, ModalProps } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    title: 'Уведомление',
    message: 'Текст сообщения по умолчанию.',
  },
}

export default meta
type Story = StoryObj<typeof Modal>

const Template = (props: ModalProps) => {
  const [open, setOpen] = useState(true)
  const [isAgreed, setIsAgreed] = useState(false) // Для кейса с чекбоксом

  const backgroundStyle: React.CSSProperties = {
    minHeight: '200vh',
    padding: '50px',
    backgroundColor: '#f5f5f5',
    color: '#1c1c1c',
  }

  const dummyText = Array(20)
    .fill(
      'Это фоновый текст. Он должен быть виден, когда модальное окно открыто. Мы проверяем, что оверлей затемняет этот контент, но сам контент остается виден за оверлеем. '
    )
    .join(' ')

  // Для CreatePayment: блокируем кнопку, пока чекбокс не отмечен
  const isButtonDisabled = props.hasCheckbox ? !isAgreed : props.isActionDisabled

  return (
    <div style={backgroundStyle}>
      <h1>Контент страницы (фон)</h1>
      <p>{dummyText}</p>
      <Modal
        {...props}
        open={open}
        onOpenChange={setOpen}
        isActionDisabled={isButtonDisabled}
        onCheckboxChange={props.hasCheckbox ? setIsAgreed : props.onCheckboxChange}
      />
    </div>
  )
}

// --- STORIES ---

// 1. Email Sent
export const EmailSent: Story = {
  render: Template,
  args: {
    title: 'Email Sent',
    message: 'We have sent a link to confirm your email to epam@epam.com.',
    buttonText: 'OK',
    confirmMode: false, // Одна кнопка (режим простого уведомления)
    onAction: () => alert('Нажата кнопка OK — уведомление подтверждено'),
  },
}

// 2. Error
export const Error: Story = {
  render: Template,
  args: {
    title: 'Error',
    message: 'Transaction failed. Please, write to support',
    buttonText: 'Back to payment',
    confirmMode: false, // Одна кнопка
    onAction: () => alert('Пользователь возвращается к оплате'),
  },
}

// 3. Logout
export const LogoutConfirmation: Story = {
  render: Template,
  args: {
    title: 'Log Out',
    message: 'Are you really want to log out of your account "Epam@epam.com"?',
    confirmMode: true, // Две кнопки (режим подтверждения)
    buttonText: 'Yes', // Правая кнопка — действие
    cancelButtonText: 'No', // Левая кнопка — отмена
    isCancelPrimary: true, // Левая кнопка (Cancel) выделена Primary
    onAction: () => alert('Пользователь подтвердил выход'),
    onCancel: () => alert('Пользователь отменил выход'),
  },
}

// 4. Discard Confirmation
export const DiscardConfirmation: Story = {
  render: Template,
  args: {
    title: 'Close',
    message: 'Do you really want to close the creation of a publication? If you close everything will be deleted',
    confirmMode: true, // Две кнопки
    buttonText: 'Save draft', // Правая кнопка — действие
    cancelButtonText: 'Discard', // Левая кнопка — отмена
    isCancelPrimary: false, // По умолчанию Action (правая) — primary
    actionsJustifyBetween: true, // Развести кнопки по краям (justify-content: space-between)
    onAction: () => alert('Черновик сохранен'),
    onCancel: () => alert('Отменено без сохранения'),
  },
}

// 5. Create Payment
export const CreatePayment: Story = {
  render: Template,
  args: {
    title: 'Create payment',
    message: 'Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings',
    buttonText: 'OK',
    confirmMode: false, // Одна кнопка + чекбокс
    hasCheckbox: true, // Показываем чекбокс
    checkboxText: 'I agree',
    onAction: () => alert('Пользователь согласился с условиями и нажал i agree'),
  },
}
