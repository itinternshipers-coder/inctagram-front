import storybook from 'eslint-plugin-storybook'
import next from 'eslint-config-next'
import prettier from 'eslint-config-prettier'

const eslintConfig = [
  // Конфиг Next.js 16 (уже включает TypeScript и React)
  ...next,

  // Storybook конфиг для stories файлов
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    ...storybook.configs['flat/recommended'],
  },

  // Дополнительные правила для Storybook
  {
    files: ['src/stories/**/*'],
    rules: {
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'storybook/hierarchy-separator': 'off',
      'storybook/no-redundant-story-name': 'error',
    },
  },

  // Дополнительные глобальные правила
  {
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

  // Глобалы для тестов
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
    },
  },

  prettier,
]

export default eslintConfig
