import SuperPagination from '@/shared/ui/super-pagination/SuperPagination'
import { Meta } from '@storybook/nextjs-vite'
import { useState } from 'react'

const meta: Meta<typeof SuperPagination> = {
  title: 'Components/SuperPagination',
  component: SuperPagination,
}

export default meta

const options = [
  { id: 10, value: 10 },
  { id: 20, value: 20 },
  { id: 30, value: 30 },
  { id: 50, value: 50 },
  { id: 100, value: 100 },
]

export const Default = () => {
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(5)
  const totalCount = 100

  const handleChange = (newPage: number, newCount: number) => {
    setPage(newPage)
    setCount(newCount)
  }

  return <SuperPagination page={page} count={count} totalCount={totalCount} options={options} onChange={handleChange} />
}
