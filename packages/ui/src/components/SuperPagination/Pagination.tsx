'use client'
import React, { useMemo } from 'react'
import s from './Pagination.module.scss'
import { ArrowIosBackOutlineIcon, ArrowIosForwardOutlineIcon } from '../../icons'

export type PaginationProps = {
  totalCount: number
  itemsPerPage: number
  currentPage: number
  onChange: (page: number) => void
  siblingCount?: number
}

const Pagination = ({ totalCount, itemsPerPage, currentPage, onChange, siblingCount = 1 }: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage))
  const safeCurrent = Math.min(Math.max(1, currentPage), totalPages)

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'dots')[] = []

    const leftSiblingIndex = Math.max(safeCurrent - siblingCount, 1)
    const rightSiblingIndex = Math.min(safeCurrent + siblingCount, totalPages)

    const showLeftDots = leftSiblingIndex > 2
    const showRightDots = rightSiblingIndex < totalPages - 1

    pages.push(1)

    if (showLeftDots) {
      pages.push('dots')
    } else {
      for (let i = 2; i < leftSiblingIndex; i++) pages.push(i)
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) pages.push(i)

    if (showRightDots) {
      pages.push('dots')
    } else {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) pages.push(i)
    }

    if (totalPages > 1) pages.push(totalPages)

    const uniq: (number | 'dots')[] = []
    for (const p of pages) {
      const prev = uniq[uniq.length - 1]
      if (p === 'dots' && prev === 'dots') continue
      if (typeof p === 'number' && p === prev) continue
      uniq.push(p)
    }

    return uniq
  }, [totalPages, safeCurrent, siblingCount])

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === safeCurrent) return
    onChange(page)
  }

  return (
    <div className={s.pagination}>
      <button
        className={s.navButton}
        onClick={() => goTo(safeCurrent - 1)}
        disabled={safeCurrent === 1}
        aria-label="Previous page"
      >
        <ArrowIosBackOutlineIcon size={15} />
      </button>

      <div className={s.pages}>
        {paginationRange.map((item, idx) =>
          item === 'dots' ? (
            <span key={`dots-${idx}`} className={s.dots}>
              …
            </span>
          ) : (
            <button
              key={item}
              className={s.pageButton + (item === safeCurrent ? ` ${s.active}` : '')}
              onClick={() => goTo(item)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') goTo(safeCurrent - 1)
                if (e.key === 'ArrowRight') goTo(safeCurrent + 1)
              }}
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
        aria-label="Next page"
      >
        <ArrowIosForwardOutlineIcon size={15} />
      </button>
    </div>
  )
}

export default Pagination
