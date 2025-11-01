import React, { useState } from 'react'
// import { Meta, StoryObj } from '@storybook/react'
import Pagination from '@/shared/ui/SuperPagination/Pagination'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

// Мета-описание
const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
}

export default meta
type Story = StoryObj<typeof Pagination>

// Моковый массив данных для демонстрации
const mockItems = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  user: `User ${i + 1}`,
  content: `Это контент поста номер ${i + 1}`,
}))

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const itemsPerPage = 5

    // Берём элементы текущей страницы
    const currentItems = mockItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)

    return (
      <div>
        {/* Пагинация */}
        <Pagination
          totalCount={mockItems.length}
          itemsPerPage={itemsPerPage}
          currentPage={page}
          onChange={setPage}
          siblingCount={1}
        />

        {/* Список элементов на текущей странице */}
        <div style={{ marginTop: '20px' }}>
          {currentItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            >
              <strong>{item.user}</strong>
              <p>{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
