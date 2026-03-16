import { initialize, mswLoader } from 'msw-storybook-addon'
import { handlers } from './mocks/handlers'
import type { Preview } from '@storybook/nextjs-vite'
import '@/styles/globals.scss'
import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authSlice from '@/features/auth/model/auth-slice'
import { baseApi } from '@/shared/api/base-api'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'


// Инициализация MSW
initialize()

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  })
}

const preview: Preview = {
  parameters: {
    msw: {
      handlers,
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
        query: {},
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => {
      const store = createMockStore()
      return (
        <Provider store={store}>
          <ThemeProvider>
            <Story />
          </ThemeProvider>
        </Provider>
      )
    },
    (Story, context) => {
      const theme = context.globals.theme || 'dark'
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme)
      }
      return React.createElement('div', { style: { padding: '20px', minHeight: '100vh' } }, React.createElement(Story))
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      initialValue: 'dark',
      toolbar: {
        icon: 'moon',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
}

export default preview
