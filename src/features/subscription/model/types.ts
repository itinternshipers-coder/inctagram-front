export type SubscriptionPlan = {
  id: string
  name: string
  price: string
  durationDays: number
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateSubscriptionRequest = {
  subscriptionPaymentsPlanId: string
  accountType: 'PERSONAL' | 'BUSINESS'
  paymentProvider: 'STRIPE' | 'PAYPAL'
}

export type CreateSubscriptionResponse = {
  approvalUrl: string
}

export type CaptureSubscriptionResponse = {
  subscriptionId: string
  status: string
}

export type CurrentSubscription = {
  id: string
  userId: string
  subscriptionPaymentsPlanId: string
  accountType: string
  status: string
  autoRenewal: boolean
  expiresAt: string
  nextPaymentAt: string | null
  paymentProvider: string
  paymentId: string
  createdAt: string
  updatedAt: string
  subscriptionPaymentsPlan: {
    id: string
    name: string
    price: string
    durationDays: number
    description: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export type ToggleAutoRenewalRequest = {
  subscriptionId: string
  autoRenewal: boolean
}

export type PaymentRecord = {
  id: string
  dateOfPayment: string
  endDateOfSubscription: string
  price: number
  subscriptionType: string
  paymentType: string
}

export type MyPaymentsResponse = {
  items: PaymentRecord[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export type MyPaymentsParams = {
  page?: number
  pageSize?: number
}
