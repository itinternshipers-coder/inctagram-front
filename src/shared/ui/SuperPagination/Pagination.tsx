'use client'
import React, { useMemo } from 'react'
import s from './Pagination.module.scss'
import { ArrowIosBackOutlineIcon, ArrowIosForwardOutlineIcon } from '@/shared/icons/svgComponents'

export type PaginationProps = {
  totalCount: number // общее количество элементов
  itemsPerPage: number // количество элементов на одной странице
  currentPage: number // номер текущей страницы (начиная с 1)
  onChange: (page: number) => void // вызывается при смене страницы
  siblingCount?: number // количество страниц, показываемых по бокам от активной
}

const Pagination = ({ totalCount, itemsPerPage, currentPage, onChange, siblingCount = 1 }: PaginationProps) => {
  // Общее количество страниц
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage))

  // Нормализуем текущую страницу — чтобы она не выходила за границы
  const safeCurrent = Math.min(Math.max(1, currentPage), totalPages)

  // Формируем список страниц и точек "..."
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5 // количество позиций (страницы + точки)

    // Если страниц немного — показываем все
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'dots')[] = []

    const leftSiblingIndex = Math.max(safeCurrent - siblingCount, 1)
    const rightSiblingIndex = Math.min(safeCurrent + siblingCount, totalPages)

    const showLeftDots = leftSiblingIndex > 2
    const showRightDots = rightSiblingIndex < totalPages - 1

    // Первая страница — всегда отображается
    pages.push(1)

    // Точки слева
    if (showLeftDots) {
      pages.push('dots')
    } else {
      for (let i = 2; i < leftSiblingIndex; i++) pages.push(i)
    }

    // Центральные страницы (вокруг активной)
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) pages.push(i)

    // Точки справа
    if (showRightDots) {
      pages.push('dots')
    } else {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) pages.push(i)
    }

    // Последняя страница — всегда отображается
    if (totalPages > 1) pages.push(totalPages)

    // Убираем дубликаты и лишние точки
    const uniq: (number | 'dots')[] = []
    for (const p of pages) {
      const prev = uniq[uniq.length - 1]
      if (p === 'dots' && prev === 'dots') continue
      if (typeof p === 'number' && p === prev) continue
      uniq.push(p)
    }

    return uniq
  }, [totalPages, safeCurrent, siblingCount])

  // Смена страницы по клику
  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === safeCurrent) return
    onChange(page)
  }

  return (
    <div className={s.pagination}>
      {/* Кнопка "Назад" */}
      <button
        className={s.navButton}
        onClick={() => goTo(safeCurrent - 1)}
        disabled={safeCurrent === 1}
        aria-label="Предыдущая страница"
      >
        <ArrowIosBackOutlineIcon size={15} />
      </button>

      {/* Список страниц */}
      <div className={s.pages}>
        {paginationRange.map((item, idx) =>
          item === 'dots' ? (
            <span key={`dots-${idx}`} className={s.dots}>
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => goTo(item)}
              className={`${s.pageButton} ${item === safeCurrent ? s.active : ''}`}
              aria-current={item === safeCurrent ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        className={s.navButton}
        onClick={() => goTo(safeCurrent + 1)}
        disabled={safeCurrent === totalPages}
        aria-label="Следующая страница"
      >
        <ArrowIosForwardOutlineIcon size={15} />
      </button>
    </div>
  )
}

export default Pagination
