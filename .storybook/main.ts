import type { StorybookConfig } from '@storybook/nextjs-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: [path.join(__dirname, '..', 'public')],
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tsconfigPaths()]

    // Добавляем резолвер для SCSS
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/styles': path.resolve(__dirname, '../src/styles'),
        '@/shared': path.resolve(__dirname, '../src/shared'),
        '@': path.resolve(__dirname, '../src'),
      }
    }

    return config
  },
}

export default config
