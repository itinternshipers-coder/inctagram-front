import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import SuperPagination from './SuperPagination'

const meta: Meta<typeof SuperPagination> = {
  title: 'UI/SuperPagination',
  component: SuperPagination,
}

export default meta
type Story = StoryObj<typeof SuperPagination>

const options = [
  { id: 1, value: 1 },
  { id: 5, value: 5 },
  { id: 10, value: 10 },
  { id: 20, value: 20 },
  { id: 30, value: 30 },
  { id: 50, value: 50 },
  { id: 100, value: 100 },
]

// 🔹 Компонент-обёртка для Storybook, где есть реальные данные
const PaginationExample = () => {
  const totalItems = 50
  const dummyItems = Array.from({ length: totalItems }, (_, i) => ({
    id: i + 1,
    title: `Элемент №${i + 1}`,
  }))

  const [page, setPage] = useState(1)
  const [count, setCount] = useState(10)

  const onChange = (newPage: number, newCount: number) => {
    setPage(newPage)
    setCount(newCount)
  }

  const start = (page - 1) * count
  const end = start + count
  const visibleItems = dummyItems.slice(start, end)

  return (
    <div style={{ width: 400, margin: '0 auto', textAlign: 'center' }}>
      <div
        style={{
          border: '1px solid #333',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px',
          backgroundColor: '#1a1a1a',
          color: 'white',
        }}
      >
        {visibleItems.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>

      <SuperPagination page={page} count={count} totalCount={totalItems} onChange={onChange} options={options} />
    </div>
  )
}

export const Default: Story = {
  render: () => <PaginationExample />,
}
