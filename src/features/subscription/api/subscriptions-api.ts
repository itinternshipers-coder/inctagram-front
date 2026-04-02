import { baseApi } from '@/shared/api/base-api'
import { API_ENDPOINTS, EndpointHelpers } from '@/shared/api/endpoints'
import {
  SubscriptionPlan,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  CaptureSubscriptionResponse,
  CurrentSubscription,
  ToggleAutoRenewalRequest,
  MyPaymentsResponse,
  MyPaymentsParams,
} from '@/features/subscription/model/types'

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<SubscriptionPlan[], void>({
      query: () => ({
        url: API_ENDPOINTS.SUBSCRIPTIONS.PLANS,
        method: 'GET',
      }),
      providesTags: ['Subscriptions'],
    }),

    getCurrentSubscription: builder.query<CurrentSubscription, void>({
      query: () => ({
        url: API_ENDPOINTS.SUBSCRIPTIONS.CURRENT,
        method: 'GET',
      }),
      providesTags: ['Subscriptions'],
    }),

    getUserSubscriptions: builder.query<CurrentSubscription[], void>({
      query: () => ({
        url: API_ENDPOINTS.SUBSCRIPTIONS.BASE,
        method: 'GET',
      }),
      providesTags: ['Subscriptions'],
    }),

    createSubscription: builder.mutation<CreateSubscriptionResponse, CreateSubscriptionRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.SUBSCRIPTIONS.CREATE,
        method: 'POST',
        body,
      }),
    }),

    captureSubscription: builder.mutation<CaptureSubscriptionResponse, string>({
      query: (orderId) => ({
        url: EndpointHelpers.subscriptions.capture(orderId),
        method: 'POST',
      }),
      invalidatesTags: ['Subscriptions'],
    }),

    toggleAutoRenewal: builder.mutation<void, ToggleAutoRenewalRequest>({
      query: ({ subscriptionId, autoRenewal }) => ({
        url: EndpointHelpers.subscriptions.autoRenewal(subscriptionId),
        method: 'PATCH',
        body: { autoRenewal },
      }),
      invalidatesTags: ['Subscriptions'],
    }),

    getMyPayments: builder.query<MyPaymentsResponse, MyPaymentsParams>({
      query: (params) => ({
        url: API_ENDPOINTS.SUBSCRIPTIONS.MY_PAYMENTS,
        method: 'GET',
        params,
      }),
      providesTags: ['Subscriptions'],
    }),
  }),
})

export const {
  useGetPlansQuery,
  useGetCurrentSubscriptionQuery,
  useGetUserSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useCaptureSubscriptionMutation,
  useToggleAutoRenewalMutation,
  useGetMyPaymentsQuery,
} = subscriptionsApi
