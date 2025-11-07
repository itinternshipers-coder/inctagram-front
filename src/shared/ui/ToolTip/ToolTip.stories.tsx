import { Button } from '@/shared/ui/button/Button'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import ToolTip from './ToolTip'

const meta: Meta<typeof ToolTip> = {
  title: 'Components/ToolTip',
  component: ToolTip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Позиция тултипа относительно элемента',
    },
  },
}
export default meta
type Story = StoryObj<typeof ToolTip>

export const Default: Story = {
  args: {
    text: (
      <div>
        <strong>Помните!</strong>
        <div>Вид календаря зависит от реализации выбранной библиотеки</div>
      </div>
    ),
    children: <Button variant="primary">Наведи на меня</Button>,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 50px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export const LongText: Story = {
  args: {
    text: (
      <div>
        <strong>Информация:</strong>
        <div>
          Этот компонент используется для отображения кратких подсказок при наведении курсора. Не стоит помещать внутрь
          сложный контент или интерактивные элементы.
        </div>
      </div>
    ),
    children: <Button variant="primary">Длинная подсказка</Button>,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 50px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export const Top: Story = {
  args: {
    text: 'Тултип сверху (top)',
    position: 'top',
    children: <Button variant="primary">Top Position</Button>,
    sideOffset: 0,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 50px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export const Right: Story = {
  args: {
    text: 'Тултип справа (right)',
    position: 'right',
    children: <Button variant="primary">Right Position</Button>,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 50px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export const Bottom: Story = {
  args: {
    text: 'Тултип снизу (bottom)',
    position: 'bottom',
    children: <Button variant="primary">Bottom Position</Button>,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 50px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export const Left: Story = {
  args: {
    text: 'Тултип слева (left)',
    position: 'left',
    children: <Button variant="primary">Left Position</Button>,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 50px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export const AllPositions: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '80px',
        padding: '120px 80px',
        minHeight: '500px',
        minWidth: '500px',
      }}
    >
      {/* Top */}
      <ToolTip text="Тултип сверху (top)" position="top">
        <Button variant="primary">Top</Button>
      </ToolTip>

      {/* Middle row - Left and Right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '120px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <ToolTip text="Тултип слева (left)" position="left">
          <Button variant="secondary">Left</Button>
        </ToolTip>

        <ToolTip text="Тултип справа (right)" position="right">
          <Button variant="secondary">Right</Button>
        </ToolTip>
      </div>

      {/* Bottom */}
      <ToolTip text="Тултип снизу (bottom)" position="bottom">
        <Button variant="primary">Bottom</Button>
      </ToolTip>
    </div>
  ),
}
