import { CurrentSubscription, SubscriptionPlan } from '@/features/subscription/model/types'

export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-1-day',
    name: '$10 per 1 Day',
    price: '10',
    durationDays: 1,
    description: 'Daily subscription plan',
    isActive: true,
    createdAt: '2026-01-30T11:08:04.509Z',
    updatedAt: '2026-01-30T11:08:04.509Z',
  },
  {
    id: 'plan-7-day',
    name: '$50 per 7 Day',
    price: '50',
    durationDays: 7,
    description: 'Weekly subscription plan',
    isActive: true,
    createdAt: '2026-01-30T11:08:07.203Z',
    updatedAt: '2026-01-30T11:08:07.203Z',
  },
  {
    id: 'plan-monthly',
    name: '$100 per month',
    price: '100',
    durationDays: 30,
    description: 'Monthly subscription plan',
    isActive: true,
    createdAt: '2026-01-30T11:08:10.145Z',
    updatedAt: '2026-01-30T11:08:10.145Z',
  },
]

const basePlan = {
  id: 'plan-1-day',
  name: '$10 per 1 Day',
  price: '10',
  durationDays: 1,
  description: 'Daily subscription plan',
  isActive: true,
  createdAt: '2026-01-30T11:08:04.509Z',
  updatedAt: '2026-01-30T11:08:04.509Z',
}

const weeklyPlan = {
  id: 'plan-7-day',
  name: '$50 per 7 Day',
  price: '50',
  durationDays: 7,
  description: 'Weekly subscription plan',
  isActive: true,
  createdAt: '2026-01-30T11:08:07.203Z',
  updatedAt: '2026-01-30T11:08:07.203Z',
}

// Сценарий: нет подписок (новый пользователь)
export const mockNoSubscriptions: CurrentSubscription[] = []

// Сценарий: одна активная подписка
export const mockOneActive: CurrentSubscription[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    subscriptionPaymentsPlanId: 'plan-1-day',
    accountType: 'BUSINESS',
    status: 'ACTIVE',
    autoRenewal: true,
    expiresAt: '2026-03-20T14:57:38.739Z',
    nextPaymentAt: '2026-03-19T14:57:38.739Z',
    paymentProvider: 'STRIPE',
    paymentId: 'pay-1',
    createdAt: '2026-03-13T14:54:50.762Z',
    updatedAt: '2026-03-13T14:54:50.762Z',
    subscriptionPaymentsPlan: basePlan,
  },
]

// Сценарий: одна ACTIVE + одна QUEUED (корректное поведение бэкенда)
export const mockActiveAndQueued: CurrentSubscription[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    subscriptionPaymentsPlanId: 'plan-1-day',
    accountType: 'BUSINESS',
    status: 'ACTIVE',
    autoRenewal: false,
    expiresAt: '2026-03-20T14:57:38.739Z',
    nextPaymentAt: '2026-03-19T14:57:38.739Z',
    paymentProvider: 'STRIPE',
    paymentId: 'pay-1',
    createdAt: '2026-03-12T14:54:50.762Z',
    updatedAt: '2026-03-12T14:54:50.762Z',
    subscriptionPaymentsPlan: basePlan,
  },
  {
    id: 'sub-2',
    userId: 'user-1',
    subscriptionPaymentsPlanId: 'plan-7-day',
    accountType: 'BUSINESS',
    status: 'QUEUED',
    autoRenewal: true,
    expiresAt: '2026-03-27T14:57:38.739Z',
    nextPaymentAt: '2026-03-26T14:57:38.739Z',
    paymentProvider: 'STRIPE',
    paymentId: 'pay-2',
    createdAt: '2026-03-13T10:00:00.000Z',
    updatedAt: '2026-03-13T10:00:00.000Z',
    subscriptionPaymentsPlan: weeklyPlan,
  },
]

// Сценарий: все подписки истекли
export const mockAllExpired: CurrentSubscription[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    subscriptionPaymentsPlanId: 'plan-1-day',
    accountType: 'BUSINESS',
    status: 'EXPIRED',
    autoRenewal: false,
    expiresAt: '2026-03-10T14:57:38.739Z',
    nextPaymentAt: null,
    paymentProvider: 'STRIPE',
    paymentId: 'pay-1',
    createdAt: '2026-03-09T14:54:50.762Z',
    updatedAt: '2026-03-10T14:57:38.739Z',
    subscriptionPaymentsPlan: basePlan,
  },
]

// Сценарий: все CANCELLED (неоплаченные)
export const mockAllCancelled: CurrentSubscription[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    subscriptionPaymentsPlanId: 'plan-1-day',
    accountType: 'BUSINESS',
    status: 'CANCELLED',
    autoRenewal: true,
    expiresAt: '2026-03-13T14:34:19.681Z',
    nextPaymentAt: null,
    paymentProvider: 'STRIPE',
    paymentId: 'pay-1',
    createdAt: '2026-03-12T14:34:20.911Z',
    updatedAt: '2026-03-12T14:54:50.624Z',
    subscriptionPaymentsPlan: basePlan,
  },
]
