'use client'

import clsx from 'clsx'
import { Card } from '@/shared/ui/Card/Card'
import { RadioGroup } from '@/shared/ui/RadioGroup/RadioGroup'
import { Typography } from '@/shared/ui/Typography/Typography'
import { useState, useEffect } from 'react'
import s from './AccountManagementTab.module.scss'
import { PaypalLogoIcon, StripeLogoIcon } from '@/shared/icons/svgComponents'
import { CheckBox } from '@/shared/ui/CheckBox/CheckBox'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Alert } from '@/shared/ui/Alert/Alert'
import {
  useGetPlansQuery,
  useGetUserSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useToggleAutoRenewalMutation,
} from '@/features/subscription/api/subscriptions-api'
import type { CurrentSubscription } from '@/features/subscription/model/types'

const SUBSCRIPTION_STATUS_PRIORITY: Record<string, number> = {
  ACTIVE: 0,
  QUEUED: 1,
  PENDING_PAYMENT: 2,
  CANCELLED: 3,
  EXPIRED: 4,
}

function sortByStatusThenExpiry(a: CurrentSubscription, b: CurrentSubscription) {
  const priorityA = SUBSCRIPTION_STATUS_PRIORITY[a.status] ?? 4
  const priorityB = SUBSCRIPTION_STATUS_PRIORITY[b.status] ?? 4

  if (priorityA !== priorityB) return priorityA - priorityB

  return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
}

export function AccountManagementTab() {
  const { data: subscriptionPlans, isLoading: isPlansLoading } = useGetPlansQuery()
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useGetUserSubscriptionsQuery()

  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation()
  const [toggleAutoRenewal] = useToggleAutoRenewalMutation()

  const [selectedAccountType, setSelectedAccountType] = useState<string | undefined>()
  const [selectedSubscriptionPlanId, setSelectedSubscriptionPlanId] = useState<string | undefined>()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [agreedToAutoRenewal, setAgreedToAutoRenewal] = useState(false)
  const [pendingProvider, setPendingProvider] = useState<'STRIPE' | 'PAYPAL' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const allSubscriptions = subscriptions?.slice().sort(sortByStatusThenExpiry) ?? []

  const hasActiveSubscriptions = allSubscriptions.some((sub) => sub.status === 'ACTIVE' || sub.status === 'QUEUED')

  useEffect(() => {
    if (!isSubscriptionsLoading) {
      setSelectedAccountType(hasActiveSubscriptions ? 'business' : 'personal')
    }
  }, [isSubscriptionsLoading, hasActiveSubscriptions])

  const autoRenewalSubscription = allSubscriptions
    .filter((sub) => sub.status === 'ACTIVE' || sub.status === 'QUEUED')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

  const accountTypeOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
  ]

  const subscriptionPlanOptions =
    subscriptionPlans?.map((plan) => ({
      value: plan.id,
      label: plan.name,
    })) ?? []

  useEffect(() => {
    if (subscriptionPlans?.length && !selectedSubscriptionPlanId) {
      setSelectedSubscriptionPlanId(subscriptionPlans[0].id)
    }
  }, [subscriptionPlans, selectedSubscriptionPlanId])

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '—'

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handlePaymentClick = (provider: 'STRIPE' | 'PAYPAL') => {
    if (!selectedSubscriptionPlanId) return
    setPendingProvider(provider)
    setAgreedToAutoRenewal(false)
    setShowConfirmModal(true)
  }

  const handleConfirmPayment = async () => {
    if (!selectedSubscriptionPlanId || !pendingProvider) return

    try {
      const result = await createSubscription({
        subscriptionPaymentsPlanId: selectedSubscriptionPlanId,
        accountType: 'BUSINESS',
        paymentProvider: pendingProvider,
      }).unwrap()

      if (result.approvalUrl) {
        window.location.href = result.approvalUrl
      }
    } catch {
      setError('Failed to create subscription. Please try again.')
    } finally {
      setShowConfirmModal(false)
      setPendingProvider(null)
    }
  }

  const handleAutoRenewalToggle = async (checked: boolean | 'indeterminate') => {
    if (!autoRenewalSubscription || typeof checked !== 'boolean') return

    try {
      await toggleAutoRenewal({
        subscriptionId: autoRenewalSubscription.id,
        autoRenewal: checked,
      }).unwrap()
    } catch {
      setError('Failed to toggle auto-renewal. Please try again.')
    }
  }

  if (isPlansLoading || isSubscriptionsLoading) {
    return (
      <div className={s.loadingContainer}>
        <Typography>Loading current Subscription...</Typography>
      </div>
    )
  }

  const badgeConfig: Record<string, { class: string; label: string }> = {
    ACTIVE: { class: s.badgeActive, label: 'Active' },
    QUEUED: { class: s.badgeQueued, label: 'In queue' },
    PENDING_PAYMENT: { class: s.badgePending, label: 'Pending payment' },
    CANCELLED: { class: s.badgeCancelled, label: 'Cancelled (not paid)' },
    EXPIRED: { class: s.badgeExpired, label: 'Expired' },
  }

  return (
    <div>
      {allSubscriptions.length > 0 && (
        <>
          <Typography className={s.sectionTitle}>Current Subscription:</Typography>

          {allSubscriptions.map((sub) => {
            const config = badgeConfig[sub.status]

            return (
              <Card as="div" className={s.subscriptionCard} key={sub.id}>
                <div className={s.subscriptionHeader}>
                  <span className={s.subscriptionPlanName}>{sub.subscriptionPaymentsPlan.name}</span>
                  <span className={clsx(s.badge, config?.class ?? s.badgeExpired)}>{config?.label ?? sub.status}</span>
                </div>
                <div className={s.subscriptionInfo}>
                  <div className={s.subscriptionField}>
                    <span className={s.label}>Expire at</span>
                    <span>{formatDate(sub.expiresAt)}</span>
                  </div>
                  <div className={s.subscriptionField}>
                    <span className={s.label}>Next payment</span>
                    <span>{formatDate(sub.nextPaymentAt)}</span>
                  </div>
                </div>
              </Card>
            )
          })}
          <div className={s.autoRenewalWrapper}>
            <CheckBox
              name="Auto-Renewal"
              checked={autoRenewalSubscription?.autoRenewal ?? false}
              onCheckedChange={handleAutoRenewalToggle}
            />
          </div>
        </>
      )}

      <Typography className={s.sectionTitle}>Account type:</Typography>
      <Card as="div" className={s.radioCard}>
        <RadioGroup
          name="accountType"
          options={accountTypeOptions}
          value={selectedAccountType}
          onChange={setSelectedAccountType}
          className={s.radioGroup}
        />
      </Card>

      {selectedAccountType === 'business' && (
        <>
          <Typography>{hasActiveSubscriptions ? 'Change your subscription:' : 'Your subscription costs:'}</Typography>
          <Card as="div" className={s.radioCard}>
            <RadioGroup
              name="subscriptionPlan"
              options={subscriptionPlanOptions}
              value={selectedSubscriptionPlanId}
              onChange={setSelectedSubscriptionPlanId}
              className={s.radioGroup}
            />
          </Card>
          <div className={s.paymentOptions}>
            <button
              type="button"
              className={s.paymentButton}
              onClick={() => handlePaymentClick('PAYPAL')}
              disabled={!selectedSubscriptionPlanId || isCreating}
            >
              <PaypalLogoIcon width={96} height={64} />
            </button>
            <span>Or</span>
            <button
              type="button"
              className={s.paymentButton}
              onClick={() => handlePaymentClick('STRIPE')}
              disabled={!selectedSubscriptionPlanId || isCreating}
            >
              <StripeLogoIcon width={96} height={64} />
            </button>
          </div>
        </>
      )}

      {error && <Alert status="error" text={error} position="bottom-left" autoDismiss={5000} />}

      <Modal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title="Confirm payment"
        message="Auto-renewal will be enabled with this payment. You can disable it anytime in your account settings."
        hasCheckbox
        checkboxText="I agree to the auto-renewal terms"
        isActionDisabled={!agreedToAutoRenewal}
        onCheckboxChange={(checked) => {
          if (typeof checked === 'boolean') {
            setAgreedToAutoRenewal(checked)
          }
        }}
        buttonText="OK"
        onAction={handleConfirmPayment}
      />
    </div>
  )
}
