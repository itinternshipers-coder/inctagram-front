import type { Preview } from '@storybook/nextjs-vite'
import '../src/styles/globals.scss'
import React from 'react'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../src/features/auth/model/auth-slice'
import { baseApi } from '../src/shared/api/base-api'

// Создаём store для Storybook
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
  decorators: [
    // Redux Provider декоратор
    (Story) => {
      const store = createMockStore()
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      )
    },

    (Story, context) => {
      const theme = context.globals.theme || 'dark'

      // Применяем тему к body
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
