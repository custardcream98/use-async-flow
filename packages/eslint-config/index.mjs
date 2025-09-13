import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'
import perfectionist from 'eslint-plugin-perfectionist'
import globals from 'globals'

// Base config: shared rules and ignores
/** @type {import('eslint').Linter.Config[]} */
export const base = [
  {
    ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**', '**/next-env.d.ts'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-array-includes': 'error',
      'perfectionist/sort-exports': 'error',
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-interfaces': 'error',
      'perfectionist/sort-intersection-types': 'error',
      'perfectionist/sort-jsx-props': 'error',
      'perfectionist/sort-named-exports': 'error',
      'perfectionist/sort-union-types': 'error',
    },
    settings: {
      perfectionist: {
        type: 'natural',
      },
    },
  },
]

// React library config: adds browser globals and react-hooks rules
/** @type {import('eslint').Linter.Config[]} */
export const reactLib = [
  ...base,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]

// Next app config: adds both browser and node globals (for process, etc.)
/** @type {import('eslint').Linter.Config[]} */
export const next = [
  ...base,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
