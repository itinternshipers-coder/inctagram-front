'use client'

import { Card } from '@/shared/ui/Card/Card'
import s from './MyPaymentsTab.module.scss'
import SuperPagination from '@/shared/ui/SuperPagination/SuperPagination'
import { useState } from 'react'

type PaymentRecord = {
  dateOfPayment: string
  endDateOfSubscription: string
  price: string
  subscriptionType: string
  paymentType: string
}

const paginationOptions = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
]

export function MyPaymentsTab() {
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(10)

  const handlePaginationChange = (newPage: number, newCount: number) => {
    setPage(newPage)
    setCount(newCount)
  }

  const mockPayments: PaymentRecord[] = [
    {
      dateOfPayment: '01.12.2022',
      endDateOfSubscription: '12.12.2022',
      price: '$10',
      subscriptionType: '1 day',
      paymentType: 'Stripe',
    },
    {
      dateOfPayment: '02.12.2022',
      endDateOfSubscription: '12.12.2022',
      price: '$50',
      subscriptionType: '7 days',
      paymentType: 'Stripe',
    },
    {
      dateOfPayment: '03.12.2022',
      endDateOfSubscription: '12.12.2022',
      price: '$100',
      subscriptionType: '1 month',
      paymentType: 'Stripe',
    },
    {
      dateOfPayment: '04.12.2022',
      endDateOfSubscription: '12.12.2022',
      price: '$100',
      subscriptionType: '1 month',
      paymentType: 'PayPal',
    },
    {
      dateOfPayment: '05.12.2022',
      endDateOfSubscription: '12.12.2022',
      price: '$50',
      subscriptionType: '7 days',
      paymentType: 'PayPal',
    },
    {
      dateOfPayment: '06.12.2022',
      endDateOfSubscription: '12.12.2022',
      price: '$50',
      subscriptionType: '7 days',
      paymentType: 'PayPal',
    },
    {
      dateOfPayment: '07.12.2022',
      endDateOfSubscription: '12.12.2022',
      price: '$50',
      subscriptionType: '7 days',
      paymentType: 'PayPal',
    },
    {
      dateOfPayment: '08.12.2022',
      endDateOfSubscription: '12.12.2022',
      price: '$100',
      subscriptionType: '1 month',
      paymentType: 'PayPal',
    },
  ]

  const startIndex = (page - 1) * count
  const paginatedPayments = mockPayments.slice(startIndex, startIndex + count)
  const totalCount = mockPayments.length

  return (
    <div>
      <Card as="div" className={s.paymentsCard}>
        <div>
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
              {paginatedPayments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.dateOfPayment}</td>
                  <td>{payment.endDateOfSubscription}</td>
                  <td>{payment.price}</td>
                  <td>{payment.subscriptionType}</td>
                  <td>{payment.paymentType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <SuperPagination
        page={page}
        count={count}
        totalCount={totalCount}
        onChange={handlePaginationChange}
        options={paginationOptions}
      />
    </div>
  )
}
