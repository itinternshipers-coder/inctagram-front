import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw-server'
import { renderWithProviders } from '@/test/render-with-providers'
import { MyPaymentsTab } from './MyPaymentsTab'
import { MyPaymentsResponse } from '@/features/subscription/model/types'

function setupHandlers(response: MyPaymentsResponse) {
  server.use(
    http.get('*/api/v1/subscriptions/my-payments', ({ request }) => {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page') || 1)
      const pageSize = Number(url.searchParams.get('pageSize') || 10)

      // Серверная пагинация
      const start = (page - 1) * pageSize
      const items = response.items.slice(start, start + pageSize)

      return HttpResponse.json({
        items,
        totalCount: response.totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(response.totalCount / pageSize),
      })
    })
  )
}

const mockPayments: MyPaymentsResponse = {
  items: [
    {
      id: 'sub-1',
      dateOfPayment: '2026-03-12T19:13:55.898Z',
      endDateOfSubscription: '2026-03-21T14:57:38.739Z',
      price: 10,
      subscriptionType: '1 day',
      paymentType: 'STRIPE',
    },
    {
      id: 'sub-2',
      dateOfPayment: '2026-03-12T14:58:18.118Z',
      endDateOfSubscription: '2026-03-20T14:57:38.739Z',
      price: 50,
      subscriptionType: '7 days',
      paymentType: 'STRIPE',
    },
    {
      id: 'sub-3',
      dateOfPayment: '2026-03-12T14:54:50.762Z',
      endDateOfSubscription: '2026-03-13T14:57:38.739Z',
      price: 10,
      subscriptionType: '1 day',
      paymentType: 'STRIPE',
    },
  ],
  totalCount: 3,
  page: 1,
  pageSize: 10,
  totalPages: 1,
}

const mockEmptyPayments: MyPaymentsResponse = {
  items: [],
  totalCount: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
}

describe('MyPaymentsTab', () => {
  // UC-4: Таблица с колонками по фигме
  describe('отображение таблицы', () => {
    it('показывает все 5 колонок по фигме', async () => {
      setupHandlers(mockPayments)
      renderWithProviders(<MyPaymentsTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading My Payments...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Date of Payment')).toBeInTheDocument()
      expect(screen.getByText('End date of subscription')).toBeInTheDocument()
      expect(screen.getByText('Price')).toBeInTheDocument()
      expect(screen.getByText('Subscription Type')).toBeInTheDocument()
      expect(screen.getByText('Payment Type')).toBeInTheDocument()
    })

    it('отображает данные платежей', async () => {
      setupHandlers(mockPayments)
      renderWithProviders(<MyPaymentsTab />)

      await waitFor(() => {
        expect(screen.getByText('$50')).toBeInTheDocument()
      })

      expect(screen.getAllByText('$10')).toHaveLength(2)
      expect(screen.getAllByText('1 day')).toHaveLength(2)
      expect(screen.getByText('7 days')).toBeInTheDocument()
      expect(screen.getAllByText('STRIPE')).toHaveLength(3)
    })

    it('форматирует даты в формате dd.mm.yyyy', async () => {
      setupHandlers(mockPayments)
      renderWithProviders(<MyPaymentsTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading My Payments...')).not.toBeInTheDocument()
      })

      // Проверяем формат дат (ru-RU)
      expect(screen.getAllByText('12.03.2026').length).toBeGreaterThan(0)
    })
  })

  // UC-4: Пустая таблица
  describe('нет платежей', () => {
    it('показывает пустую таблицу', async () => {
      setupHandlers(mockEmptyPayments)
      renderWithProviders(<MyPaymentsTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading My Payments...')).not.toBeInTheDocument()
      })

      // Заголовки таблицы есть, но строк нет
      expect(screen.getByText('Date of Payment')).toBeInTheDocument()
      expect(screen.queryByText('$10')).not.toBeInTheDocument()
    })

    it('не показывает пагинацию при пустых данных', async () => {
      setupHandlers(mockEmptyPayments)
      renderWithProviders(<MyPaymentsTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading My Payments...')).not.toBeInTheDocument()
      })

      expect(screen.queryByText('Show')).not.toBeInTheDocument()
    })
  })

  // UC-4, шаг 5: Пагинация
  describe('пагинация', () => {
    it('показывает пагинацию и селектор "Show N on page"', async () => {
      setupHandlers(mockPayments)
      renderWithProviders(<MyPaymentsTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading My Payments...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Show')).toBeInTheDocument()
      expect(screen.getByText('on page')).toBeInTheDocument()
    })
  })

  // Состояние загрузки
  describe('загрузка', () => {
    it('показывает лоадер при загрузке', () => {
      setupHandlers(mockPayments)
      renderWithProviders(<MyPaymentsTab />)

      expect(screen.getByText('Loading My Payments...')).toBeInTheDocument()
    })
  })
})
