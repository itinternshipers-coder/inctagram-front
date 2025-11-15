import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Notification, NotificationProps } from './  Notification'

const meta: Meta<typeof Notification> = {
  title: 'Components/Notification',
  component: Notification,
}

export default meta
type Story = StoryObj<typeof Notification>

const Template = (props: NotificationProps) => {
  const [open, setOpen] = useState(true)

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

  return (
    <div style={backgroundStyle}>
      <h1>Контент страницы (фон)</h1>
      <p>{dummyText}</p>
      <Notification {...props} open={open} onOpenChange={setOpen} />
    </div>
  )
}

export const EmailSent: Story = {
  render: Template,

  args: {
    title: 'Email sent',
    message: 'We have sent a link to confirm your email to epam@epam.com. ',
    buttonText: 'OK',
  },
}
