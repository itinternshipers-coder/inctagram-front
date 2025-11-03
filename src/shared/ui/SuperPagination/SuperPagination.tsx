'use client'

import React from 'react'
import Pagination from './Pagination'
import { Option, SelectBox } from '../SelectBox/SelectBox'
import s from './Pagination.module.scss'

export type SuperPaginationPropsType = {
  id?: string
  page: number
  count: number // Текущее количество элементов на странице (число)
  totalCount: number // Общее количество элементов
  onChange: (page: number, count: number) => void // Колбэк для смены страницы ИЛИ count
  options: Option[] // Опции для SelectBox
}

const SuperPagination = ({ options, page, count, totalCount, onChange }: SuperPaginationPropsType) => {
  // Обработчик смены страницы (использует старый count)
  const onChangeHandler = (newPage: number) => {
    onChange(newPage, count)
  }

  // Обработчик смены количества элементов на странице (использует новый count)
  const onSelectBoxChange = (newValue: string) => {
    // Преобразуем строковое значение из SelectBox в число
    const newCount = Number(newValue)

    // Валидация: если не число или <= 0, выходим
    if (isNaN(newCount) || newCount <= 0) return

    // Вычисляем новую последнюю страницу
    const newLastPage = Math.max(1, Math.ceil(totalCount / newCount))

    // Корректируем текущую страницу: она не должна превышать новую последнюю
    const newPage = Math.min(page, newLastPage)

    // Вызываем общий колбэк с новой страницей и новым count
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
