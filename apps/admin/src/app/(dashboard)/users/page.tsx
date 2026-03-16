'use client'

import { useState } from 'react'
import { Input, SelectBox } from '@inctagram/ui'
import type { Option } from '@inctagram/ui'
import { UsersTable } from '@/features/users/ui/UsersTable'
import { Pagination } from '@/features/users/ui/Pagination'
import { useUsers } from '@/features/users/api/use-users'
import { UserFilter, SortDirection } from '@/features/users/model/types'
import s from './users.module.css'

const FILTER_OPTIONS: Option[] = [
  { value: 'all', label: 'Not selected' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'not-blocked', label: 'Not Blocked' },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<UserFilter>('all')
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { users, totalPages } = useUsers({
    page: currentPage,
    pageSize,
    search,
    filter,
    sortDirection,
  })

  const handleSort = () => {
    setSortDirection((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null))
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <div className={s.container}>
      <div className={s.toolbar}>
        <Input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
          wrapperClassName={s.searchInput}
        />
        <SelectBox
          options={FILTER_OPTIONS}
          value={filter}
          onValueChange={(v) => { setFilter(v as UserFilter); setCurrentPage(1) }}
          width="200px"
        />
      </div>

      <UsersTable users={users} sortDirection={sortDirection} onSort={handleSort} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
