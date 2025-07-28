import { defineConfig } from 'eslint-define-config';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: globals.node,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Turn off base no-unused-vars, use TS version instead
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],

      // Enforce semicolons
      'semi': ['error', 'always'],

      // Allow console logs
      'no-console': 'off',

      // Disable no-undef because TS handles that
      'no-undef': 'off',

      // NEW: Require explicit return types on functions
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: false,
        allowTypedFunctionExpressions: false,
      }],

      // NEW: Require explicit types on exported functions and methods
      '@typescript-eslint/explicit-module-boundary-types': 'warn',

      // Optional: Warn on explicit any usage (uncomment if desired)
      // '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);

