'use client'

import React, { useState } from 'react'
import SuperPagination from './SuperPagination'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Option } from '../SelectBox/SelectBox'

const options: Option[] = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '30', value: '30' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
]

const meta: Meta<typeof SuperPagination> = {
  title: 'Components/SuperPagination',
  component: SuperPagination,
  argTypes: {
    page: { control: 'number' },
    count: { control: 'number' },
    totalCount: { control: 'number' },
    onChange: { action: 'onChange fired' },
  },
}

export default meta
type Story = StoryObj<typeof SuperPagination>

const SuperPaginationWrapper = ({
  initialPage = 1,
  initialCount = 10,
  totalCount = 42,
}: {
  initialPage?: number
  initialCount?: number
  totalCount?: number
}) => {
  const [page, setPage] = useState(initialPage)
  const [count, setCount] = useState(initialCount)

  const handleChange = (newPage: number, newCount: number) => {
    setPage(newPage)
    setCount(newCount)
  }

  return <SuperPagination page={page} count={count} totalCount={totalCount} onChange={handleChange} options={options} />
}

export const Default: Story = {
  name: 'Default',
  render: () => <SuperPaginationWrapper totalCount={5500} initialCount={100} />,
}

export const Active: Story = {
  name: 'Active',
  render: () => <SuperPaginationWrapper totalCount={5500} initialCount={100} initialPage={7} />,
}
export const Hover: Story = {
  name: 'Hover',
  render: () => (
    <div style={{ padding: '20px' }}>
      <SuperPaginationWrapper totalCount={5500} initialCount={100} />
    </div>
  ),
}

export const Focus: Story = {
  name: 'Tab',
  render: () => (
    <div style={{ padding: '20px' }}>
      <SuperPaginationWrapper totalCount={5500} initialCount={100} initialPage={3} />
    </div>
  ),
}
