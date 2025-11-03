import { useState } from 'react'
import Pagination from '@/shared/ui/SuperPagination/Pagination'
import { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return <Pagination totalCount={55} itemsPerPage={1} currentPage={page} onChange={setPage} siblingCount={1} />
  },
}

export const Active: Story = {
  render: () => {
    const [page, setPage] = useState(7)
    return <Pagination totalCount={55} itemsPerPage={1} currentPage={page} onChange={setPage} siblingCount={1} />
  },
}

export const Hover: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div style={{ display: 'inline-block', padding: '20px' }}>
        <Pagination totalCount={55} itemsPerPage={1} currentPage={page} onChange={setPage} siblingCount={1} />
        <style>{`
          .pagination button:first-child {
            background-color: #e0e0e0;
            border: 1px solid #999;
          }
        `}</style>{' '}
      </div>
    )
  },
}
export const Tab: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div style={{ display: 'inline-block', padding: '20px' }}>
        <Pagination totalCount={55} itemsPerPage={1} currentPage={page} onChange={setPage} siblingCount={1} />
        <style>{`
          /* Имитация Focus состояния (как будто нажали Tab) */
          .pagination .pages .pageButton:first-child {
            /* Обычно фокус обозначается рамкой (outline) */
            outline: 2px solid var(--focus-color, #007bff);
            outline-offset: 2px;
          }
          /* Если вы используете специальные стили для :focus-visible,
             их нужно имитировать здесь */
        `}</style>
      </div>
    )
  },
}
