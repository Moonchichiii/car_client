// eslint.config.js
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...js.configs.recommended.languageOptions.globals,
        browser: 'readonly',
        es2021: true,
        node: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      prettier: prettier,
    },
    rules: {
      // TypeScript rules
      ...tsPlugin.configs.recommended.rules,
      
      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      
      // JSX a11y rules
      ...jsxA11y.configs.recommended.rules,
      
      // Prettier rules
      ...prettierConfig.rules,
      'prettier/prettier': ['error', {
        endOfLine: 'auto',
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'all',
        jsxSingleQuote: false,
        semi: true,
      }],
      
      // Custom overrides
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];