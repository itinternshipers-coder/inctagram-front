'use client'

import { useState } from 'react'
import { Card } from '@/shared/ui/Card/Card'
import s from './MyPaymentsTab.module.scss'
import { Typography } from '@/shared/ui/Typography/Typography'
import { useGetMyPaymentsQuery } from '@/features/subscription/api/subscriptions-api'
import Pagination from '@/shared/ui/SuperPagination/Pagination'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export function MyPaymentsTab() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading } = useGetMyPaymentsQuery({ page, pageSize })

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '—'

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  if (isLoading)
    return (
      <div className={s.loadingContainer}>
        <Typography>Loading My Payments...</Typography>
      </div>
    )

  return (
    <div>
      <Card as="div" className={s.paymentsCard}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Date of Payment</th>
              <th>End date of subscription</th>
              <th>Price</th>
              <th>Subscription Type</th>
              <th>Payment Type</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((payment) => (
              <tr key={payment.id}>
                <td>{formatDate(payment.dateOfPayment)}</td>
                <td>{formatDate(payment.endDateOfSubscription)}</td>
                <td>${payment.price}</td>
                <td>{payment.subscriptionType}</td>
                <td>{payment.paymentType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {data && data.totalCount > 0 && (
        <div className={s.paginationWrapper}>
          <Pagination totalCount={data.totalCount} itemsPerPage={pageSize} currentPage={page} onChange={setPage} />
          <div className={s.pageSizeSelector}>
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className={s.pageSizeSelect}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>on page</span>
          </div>
        </div>
      )}
    </div>
  )
}
