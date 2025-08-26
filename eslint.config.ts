import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Shared rules for both TypeScript and JavaScript
const sharedRules = {
  // Import/Export rules
  'import/order': ['error', {
    'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    'newlines-between': 'always',
    'alphabetize': {
      'order': 'asc',
      'caseInsensitive': true,
    },
  }],
  'import/no-unresolved': 'error',
  'import/no-duplicates': 'error',
  'import/newline-after-import': 'error',

  // Code style rules
  '@stylistic/semi': ['error', 'always'], // Require semicolons
  '@stylistic/quotes': ['error', 'single'], // Require single quotes
  'no-console': 'warn',
  // JSX-specific rules
  '@stylistic/jsx-quotes': ['error', 'prefer-double'], // Use double quotes in JSX

  // Additional useful rules
  '@stylistic/comma-dangle': ['error', 'always-multiline'], // Trailing commas
  '@stylistic/indent': ['error', 2], // 2-space indentation
  '@stylistic/no-trailing-spaces': 'error', // No trailing whitespace
  '@stylistic/eol-last': 'error', // Require newline at end of file
  '@stylistic/max-len': ['error', { 'code': 110, 'tabWidth': 2, 'ignoreComments': true }],
  '@stylistic/no-multi-spaces': 'error',
};

export default tseslint.config(
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommendedTypeChecked,

  // Next.js specific rules (using compatibility layer)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Tailwind CSS Configuration Block (Replaces the previous line)
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Files to apply Tailwind rules to
    plugins: {
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      // Spreads the recommended rules from the plugin
      ...tailwindcssPlugin.configs.recommended.rules,
    },
    settings: {
      tailwindcss: {
        // Tells the plugin where to find your config file
        // Note: Use 'tailwind.config.js' if you are not using TypeScript
        config: join(__dirname, 'src/app/globals.css'),
      },
    },
  },
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
      '@stylistic': stylistic,
      'import': importPlugin,
      'tailwindcss': tailwindcssPlugin,
    },
    rules: {
      ...sharedRules as Record<string, string | object>,

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // JavaScript files configuration
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './jsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'import': importPlugin,
      '@stylistic': stylistic,
      'tailwindcss': tailwindcssPlugin,
    },
    rules: {
      ...sharedRules as Record<string, string | object>,

      // JavaScript-specific rules
      'no-unused-vars': 'error',
    },
  },

  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.vscode/**',
      '**/public/**',
      '**/coverage/**',
      'postcss.config.mjs',
      'next-env.d.ts',
    ],
  },
);
