'use client'

import { Card, RadioGroup, Typography, PaypalLogoIcon, StripeLogoIcon, CheckBox } from '@inctagram/ui'
import { useState } from 'react'
import s from './AccountManagementTab.module.scss'
import Link from 'next/link'

export function AccountManagementTab() {
  const accountTypeOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
  ]

  const accountSubscriptionCostsOptions = [
    { value: 'daily', label: '$10 per 1 Day' },
    { value: 'weekly', label: '$50 per 7 Day' },
    { value: 'monthly', label: '$100 per month' },
  ]

  const [selectedAccountType, setSelectedAccountType] = useState<string | undefined>('personal')
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<string | undefined>('daily')
  const [hasCurrentSubscription] = useState(true)
  const [autoRenewal, setAutoRenewal] = useState(true)

  const handlePlanChange = (value: string) => {
    setSelectedSubscriptionPlan(value)
  }

  return (
    <div>
      {hasCurrentSubscription ? (
        <>
          <Typography>Current Subscription:</Typography>
          <Card as="div" className={s.subscriptionCard}>
            <div className={s.subscriptionInfo}>
              <div className={s.subscriptionField}>
                <span className={s.label}>Expire at</span>
                <span>12.02.2022</span>
              </div>
              <div className={s.subscriptionField}>
                <span className={s.label}>Next payment</span>
                <span>13.02.2022</span>
              </div>
            </div>
          </Card>
          <div className={s.autoRenewalWrapper}>
            <CheckBox
              name="Auto-Renewal"
              checked={autoRenewal}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setAutoRenewal(checked)
                }
              }}
            />
          </div>
        </>
      ) : (
        ''
      )}
      <Typography>Account type:</Typography>
      <Card as="div" className={s.radioCard}>
        <RadioGroup
          name="accountType"
          options={accountTypeOptions}
          value={selectedAccountType}
          onChange={setSelectedAccountType}
          className={s.radioGroup}
        />
      </Card>
      {selectedAccountType === 'business' ? (
        <>
          <Typography>Your subscription costs:</Typography>
          <Card as="div" className={s.radioCard}>
            <RadioGroup
              name="subscriptionPlan"
              options={accountSubscriptionCostsOptions}
              value={selectedSubscriptionPlan}
              onChange={handlePlanChange}
              className={s.radioGroup}
            />
          </Card>
          <div className={s.paymentOptions}>
            <Link href={'#'}>
              <PaypalLogoIcon width={96} height={64} />
            </Link>
            <span>Or</span>
            <Link href={'#'}>
              <StripeLogoIcon width={96} height={64} />
            </Link>
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  )
}
