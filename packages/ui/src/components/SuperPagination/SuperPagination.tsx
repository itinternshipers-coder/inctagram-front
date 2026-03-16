'use client'

import React from 'react'
import Pagination from './Pagination'
import { SelectBox, type Option } from '../SelectBox/SelectBox'
import s from './Pagination.module.scss'

export type SuperPaginationPropsType = {
  id?: string
  page: number
  count: number
  totalCount: number
  onChange: (page: number, count: number) => void
  options: Option[]
}

const SuperPagination = ({ options, page, count, totalCount, onChange }: SuperPaginationPropsType) => {
  const onChangeHandler = (newPage: number) => {
    onChange(newPage, count)
  }

  const onSelectBoxChange = (newValue: string) => {
    const newCount = Number(newValue)
    if (isNaN(newCount) || newCount <= 0) return
    const newLastPage = Math.max(1, Math.ceil(totalCount / newCount))
    const newPage = Math.min(page, newLastPage)
    onChange(newPage, newCount)
  }

  return (
    <div className={s.pageContainer}>
      <Pagination totalCount={totalCount} itemsPerPage={count} currentPage={page} onChange={onChangeHandler} />

      <div className={s.selectWrapper}>
        <span>Show</span>
        <SelectBox
          options={options}
          value={String(count)}
          onValueChange={onSelectBoxChange}
          minWidth="52px"
          height="24px"
        />
        <span>on page</span>
      </div>
    </div>
  )
}

export default SuperPagination
