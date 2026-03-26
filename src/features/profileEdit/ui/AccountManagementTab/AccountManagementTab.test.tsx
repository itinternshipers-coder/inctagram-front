import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw-server'
import { renderWithProviders } from '@/test/render-with-providers'
import { AccountManagementTab } from './AccountManagementTab'
import {
  mockPlans,
  mockNoSubscriptions,
  mockOneActive,
  mockActiveAndQueued,
  mockAllExpired,
  mockAllCancelled,
} from '@/test/mocks/subscriptions'

function setupHandlers(subscriptions: unknown[]) {
  server.use(
    http.get('*/api/v1/subscriptions', () => HttpResponse.json(subscriptions)),
    http.get('*/api/v1/subscriptions/plans', () => HttpResponse.json(mockPlans))
  )
}

describe('AccountManagementTab', () => {
  // UC-1, шаг 5: По умолчанию Personal если нет подписок
  describe('новый пользователь (нет подписок)', () => {
    it('показывает Account Type = Personal по умолчанию', async () => {
      setupHandlers(mockNoSubscriptions)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading current Subscription...')).not.toBeInTheDocument()
      })

      // Radio "Personal" должен быть выбран
      const personalRadio = screen.getByLabelText('Personal')
      expect(personalRadio).toBeChecked()
    })

    it('не показывает секцию Current Subscription', async () => {
      setupHandlers(mockNoSubscriptions)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading current Subscription...')).not.toBeInTheDocument()
      })

      expect(screen.queryByText('Current Subscription:')).not.toBeInTheDocument()
    })

    it('показывает "Your subscription costs:" при выборе Business', async () => {
      setupHandlers(mockNoSubscriptions)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading current Subscription...')).not.toBeInTheDocument()
      })

      // Переключаем на Business
      const businessRadio = screen.getByLabelText('Business')
      businessRadio.click()

      await waitFor(() => {
        expect(screen.getByText('Your subscription costs:')).toBeInTheDocument()
      })
    })

    // UC-1, шаг 7: По умолчанию отмечен первый пункт
    it('первый план выбран по умолчанию', async () => {
      setupHandlers(mockNoSubscriptions)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading current Subscription...')).not.toBeInTheDocument()
      })

      const businessRadio = screen.getByLabelText('Business')
      businessRadio.click()

      await waitFor(() => {
        const firstPlan = screen.getByLabelText('$10 per 1 Day')
        expect(firstPlan).toBeChecked()
      })
    })
  })

  // Пользователь с активной подпиской
  describe('пользователь с активной подпиской', () => {
    it('показывает Account Type = Business автоматически', async () => {
      setupHandlers(mockOneActive)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading current Subscription...')).not.toBeInTheDocument()
      })

      const businessRadio = screen.getByLabelText('Business')
      expect(businessRadio).toBeChecked()
    })

    it('показывает Current Subscription с данными подписки', async () => {
      setupHandlers(mockOneActive)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.getByText('Current Subscription:')).toBeInTheDocument()
      })

      // План отображается в карточке подписки (planName class)
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('Expire at')).toBeInTheDocument()
      expect(screen.getByText('Next payment')).toBeInTheDocument()
    })

    it('показывает "Change your subscription:" вместо "Your subscription costs:"', async () => {
      setupHandlers(mockOneActive)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading current Subscription...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('Change your subscription:')).toBeInTheDocument()
      expect(screen.queryByText('Your subscription costs:')).not.toBeInTheDocument()
    })

    it('показывает чекбокс Auto-Renewal', async () => {
      setupHandlers(mockOneActive)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.getByText('Current Subscription:')).toBeInTheDocument()
      })

      expect(screen.getByText('Auto-Renewal')).toBeInTheDocument()
    })
  })

  // UC-3, шаг 8: ACTIVE + QUEUED отображаются вместе
  describe('ACTIVE + QUEUED подписки', () => {
    it('показывает обе подписки с правильными бейджами', async () => {
      setupHandlers(mockActiveAndQueued)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.getByText('Current Subscription:')).toBeInTheDocument()
      })

      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('In queue')).toBeInTheDocument()
    })

    it('ACTIVE подписка отображается первой', async () => {
      setupHandlers(mockActiveAndQueued)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.getByText('Current Subscription:')).toBeInTheDocument()
      })

      const badges = screen.getAllByText(/Active|In queue/)
      expect(badges[0]).toHaveTextContent('Active')
      expect(badges[1]).toHaveTextContent('In queue')
    })

    // UC-3, шаг 9: Auto-Renewal привязан к самой новой подписке
    it('Auto-Renewal отображается при наличии подписок', async () => {
      setupHandlers(mockActiveAndQueued)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.getByText('Current Subscription:')).toBeInTheDocument()
      })

      expect(screen.getByText('Auto-Renewal')).toBeInTheDocument()
    })
  })

  // UC-2, шаг 6: После истечения подписки → accountType = Personal
  describe('все подписки истекли', () => {
    it('переключает Account Type на Personal', async () => {
      setupHandlers(mockAllExpired)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading current Subscription...')).not.toBeInTheDocument()
      })

      const personalRadio = screen.getByLabelText('Personal')
      expect(personalRadio).toBeChecked()
    })

    it('показывает истёкшие подписки с бейджем Expired', async () => {
      setupHandlers(mockAllExpired)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.getByText('Current Subscription:')).toBeInTheDocument()
      })

      expect(screen.getByText('Expired')).toBeInTheDocument()
    })
  })

  // Все CANCELLED (неоплаченные)
  describe('все подписки CANCELLED', () => {
    it('переключает Account Type на Personal', async () => {
      setupHandlers(mockAllCancelled)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.queryByText('Loading current Subscription...')).not.toBeInTheDocument()
      })

      const personalRadio = screen.getByLabelText('Personal')
      expect(personalRadio).toBeChecked()
    })

    it('показывает отменённые подписки с бейджем Cancelled', async () => {
      setupHandlers(mockAllCancelled)
      renderWithProviders(<AccountManagementTab />)

      await waitFor(() => {
        expect(screen.getByText('Current Subscription:')).toBeInTheDocument()
      })

      expect(screen.getByText('Cancelled (not paid)')).toBeInTheDocument()
    })
  })
})
