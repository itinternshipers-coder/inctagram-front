'use client'

import { SelectBox, Typography } from '@inctagram/ui'
import type { Option } from '@inctagram/ui'
import s from './Pagination.module.css'

const PAGE_SIZE_OPTIONS: Option[] = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
]

type PaginationProps = {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  const getPages = () => {
    const pages: (number | '...')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className={s.pagination}>
      <button
        className={s.navButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className={s.dots}>...</span>
        ) : (
          <button
            key={page}
            className={`${s.pageButton} ${page === currentPage ? s.active : ''}`}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        )
      )}

      <button
        className={s.navButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>

      <div className={s.pageSize}>
        <Typography variant="regular_text_14" as="span">Show</Typography>
        <SelectBox
          options={PAGE_SIZE_OPTIONS}
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
          width="80px"
          height="32px"
        />
        <Typography variant="regular_text_14" as="span">on page</Typography>
      </div>
    </div>
  )
}
