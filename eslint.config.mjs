import storybook from 'eslint-plugin-storybook'
import nextPlugin from '@next/eslint-plugin-next'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 1. Базовые настройки для всех файлов
  {
    name: 'base',
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: true,
        document: true,
        console: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        React: true,
        JSX: true,
      },
    },
  },

  // 2. TypeScript правила
  {
    name: 'typescript',
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
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

  // 3. React правила
  {
    name: 'react',
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // 4. Next.js правила (обязательно после React)
  {
    name: 'next',
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'error',
    },
  },

  // ---- ВАЖНО: подключаем рекомендуемые flat-конфиги из eslint-plugin-storybook
  // распаковываем массив here (будут отдельные конфиги в итоговом массиве)
  ...storybook.configs['flat/recommended'],

  // если нужно изменить/отключить конфликтующие правила — добавляем отдельный override,
  // который применится после рекомендованных правил
  {
    name: 'storybook-overrides',
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    rules: {
      // переопределения (можно добавить/убрать по необходимости)
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'storybook/hierarchy-separator': 'off',
      'storybook/no-redundant-story-name': 'error',
    },
  },

  // 6. Тесты
  {
    name: 'tests',
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/tests/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
      },
    },
  },

  // 7. Игнорирование папок
  {
    name: 'ignores',
    ignores: [
      'node_modules/',
      '.next/',
      'dist/',
      'build/',
      'coverage/',
      'storybook-static/',
      'public/',
      '*.config.*',
      '**/*.d.ts',
    ],
  },

  // 8. Prettier - последним
  prettier,
]
