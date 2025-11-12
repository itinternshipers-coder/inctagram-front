import { Card } from '@/shared/ui/Card/Card'
import { Scrollbar } from '@/shared/ui/Scrollbar/Scrollbar'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { CSSProperties } from 'react'

const meta = {
  title: 'Components/ScrollArea',
  component: Scrollbar,
  tags: ['autodocs'],
} satisfies Meta<typeof Scrollbar>

export default meta

type Story = StoryObj<typeof Scrollbar>

export const ScrollAreaWithXAndYAxis: Story = {
  render: () => {
    return <ScrollAreaWrapper />
  },
}
export const ScrollAreaWithXAxis: Story = {
  render: () => {
    return <ScrollAreaWrapper length={10} wrapText="wrap" />
  },
}

export const ScrollAreaWithYAxis: Story = {
  render: () => {
    return <ScrollAreaWrapper length={2} />
  },
}

export const ScrollAreaWithDragScroll: Story = {
  args: {
    type: 'scroll', // ← Включит drag-scroll
  },
  render: (args) => {
    return <ScrollAreaWrapper {...args} />
  },
}

function ScrollAreaWrapper({
  length = 20,
  wrapText = 'nowrap',
}: {
  length?: number
  wrapText?: CSSProperties['textWrap']
}) {
  const TAGS = Array.from({ length }).map(
    (_, i, a) =>
      `Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad cum, dicta dolorum eaque eum facere hic iste neque,
       officiis omnis perspiciatis quas quod repudiandae rerum sequi voluptatum. Dolore, quia.${a.length - i}`
  )
  return (
    <Card
      style={{
        height: 600,
        width: 600,
        textWrap: wrapText,
      }}
    >
      <Scrollbar>
        {TAGS.map((tag) => (
          <div key={tag} style={{ fontSize: 13, lineHeight: 18, marginTop: 10, borderTop: 1, paddingTop: 10 }}>
            {tag}
          </div>
        ))}
      </Scrollbar>
    </Card>
  )
}
