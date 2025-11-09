// For more info: https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import storybook from 'eslint-plugin-storybook'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Базовые конфиги Next.js + TypeScript + Prettier
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),

  // Игнорируем служебные директории
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },

  // Рекомендованные правила Storybook
  ...storybook.configs['flat/recommended'],

  // Специальные исключения для Storybook файлов
  {
    files: ['src/stories/**/*'],
    rules: {
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'storybook/hierarchy-separator': 'off',
      'storybook/no-redundant-story-name': 'error',
    },
  },

  // Основные правила для всего проекта
  {
    rules: {
      // Разрешаем неиспользуемые переменные если они начинаются с _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Исключения и глобалы для тестов (Vitest, Playwright)
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/tests/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        // Vitest globals
        vi: true,
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
        afterEach: true,
        // Playwright globals
        page: true,
        browser: true,
        context: true,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'testing-library/no-render-in-setup': 'off',
    },
  },
]

export default eslintConfig
