import type { Preview } from '@storybook/nextjs-vite'
import '../src/styles/globals.scss'
import React from 'react'

const preview: Preview = {
  parameters: {
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
    (Story, context) => {
      const theme = context.globals.theme || 'dark'

      // Применяем тему к body
      if (typeof document !== 'undefined') {
        document.body.setAttribute('data-theme', theme)
      }

      return React.createElement(
        'div',
        {
          style: { padding: '20px', minHeight: '100vh' },
        },
        React.createElement(Story)
      )
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
