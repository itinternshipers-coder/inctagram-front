import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier', 'plugin:storybook/recommended'),

  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      storybook: require('eslint-plugin-storybook'),
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['src/stories/**/*'],
    rules: {
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'storybook/hierarchy-separator': 'off',
      'storybook/no-redundant-story-name': 'error',
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/tests/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        vi: true,
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
        afterEach: true,
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
