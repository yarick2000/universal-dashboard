import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended,

  // Next.js specific rules (using compatibility layer)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // TypeScript-specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Add some explicit rules to test
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      // Code style rules
      'semi': ['error', 'always'], // Require semicolons
      'quotes': ['error', 'single'], // Require single quotes
      'jsx-quotes': ['error', 'prefer-double'], // Use double quotes in JSX

      // Additional useful rules
      'comma-dangle': ['error', 'always-multiline'], // Trailing commas
      'indent': ['error', 2], // 2-space indentation
      'no-trailing-spaces': 'error', // No trailing whitespace
      'eol-last': 'error', // Require newline at end of file
    },
  },

  // JavaScript files configuration
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'semi': ['error', 'always'], // Require semicolons
      'quotes': ['error', 'single'], // Require single quotes
      'no-unused-vars': 'error',
      'no-console': 'warn',
    },
  },

  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/coverage/**',
      '**/.vscode/**',
      '**/public/**',
    ],
  },
);
