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
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'var(--dark-700)' },
        { name: 'light', value: 'var(--light-100)' },
      ],
    },
  },
  decorators: [
    (Story) => {
      return React.createElement(
        'div',
        {
          'data-theme': 'dark',
          style: { padding: '20px', minHeight: '100vh' },
        },
        React.createElement(Story)
      )
    },
  ],
}

export default preview
