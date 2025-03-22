import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import { fixupPluginRules } from '@eslint/compat';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['.git', '.vscode', '**/.idea', '**/node_modules', '**/public', '**/*.js'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: fixupPluginRules(_import),
      prettier,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          arrowFunctions: true,
        },

        project: './tsconfig.json',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
          paths: ['./src'],
        },
      },
    },

    rules: {
      'react/jsx-curly-brace-presence': [
        1,
        {
          props: 'never',
          children: 'never',
        },
      ],

      'react/jsx-boolean-value': [1, 'never'],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has'],
        },
        {
          selector: 'variable',
          format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'enum',
          format: ['StrictPascalCase'],
          prefix: ['E'],
        },
        {
          selector: 'enumMember',
          format: ['StrictPascalCase'],
        },
        {
          selector: 'interface',
          format: ['StrictPascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['StrictPascalCase'],
          prefix: ['T'],
        },
        {
          selector: 'typeParameter',
          format: ['StrictPascalCase'],
          prefix: ['G'],
        },
      ],

      'import/no-duplicates': 'error',

      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],

          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-router-dom',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@reduxjs/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-redux',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@mui/**',
              group: 'external',
              position: 'before',
            },
          ],

          pathGroupsExcludedImportTypes: ['builtin', 'react'],
          'newlines-between': 'always',
        },
      ],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0,
      'no-debugger': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      'arrow-body-style': [2, 'as-needed'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/triple-slash-reference': 0,

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'prefer-destructuring': [
        'error',
        {
          object: true,
          array: true,
        },
      ],
      semi: ['error', 'always'],
      'import/prefer-default-export': 'off',
    },
  },
];
