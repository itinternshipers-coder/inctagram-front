// import type { StorybookConfig } from '@storybook/nextjs-vite'

// const config: StorybookConfig = {
//   stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
//   addons: [
//     '@chromatic-com/storybook',
//     '@storybook/addon-docs',
//     '@storybook/addon-onboarding',
//     '@storybook/addon-a11y',
//     '@storybook/addon-vitest',
//   ],
//   framework: {
//     name: '@storybook/nextjs-vite',
//     options: {},
//   },
//   staticDirs: ['../public'],
// }
// export default config

import type { StorybookConfig } from '@storybook/nextjs-vite'
import { mergeConfig } from 'vite'
import * as path from 'path'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  staticDirs: ['../public'],

  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
    })
  },
}
export default config
