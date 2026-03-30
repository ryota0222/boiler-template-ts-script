import eslint from '@eslint/js';
import checkFile from 'eslint-plugin-check-file';
import { defineConfig } from 'eslint/config';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';
import noNestedIf from './eslint-rules/noNestedIf.js';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  perfectionist.configs['recommended-natural'],
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint-rules/*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'coverage/', '*.config.ts'],
  },
  {
    plugins: {
      local: { rules: { 'no-nested-if': noNestedIf } },
    },
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['camelCase'],
          selector: ['variable', 'function', 'parameter'],
        },
        {
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          modifiers: ['unused'],
          selector: 'parameter',
        },
        {
          format: ['PascalCase'],
          selector: ['typeLike'],
        },
      ],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          enforceConst: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          ignore: [0, 1, -1],
        },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      complexity: ['error', { max: 10 }],
      'local/no-nested-if': 'error',
      'func-style': ['error', 'expression'],
      'max-params': ['error', { max: 1 }],
      'no-undefined': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message: '相対パスではなく @/ エイリアスを使用してください',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          message: 'オプショナル引数は禁止です。引数は常に必須にしてください',
          selector:
            'FunctionDeclaration > Identifier[optional=true], ArrowFunctionExpression > Identifier[optional=true], TSParameterProperty[parameter.optional=true]',
        },
        {
          message: 'オプショナル引数は禁止です。引数は常に必須にしてください',
          selector:
            ':matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression) > :matches(Identifier[optional=true], AssignmentPattern)',
        },
      ],
    },
  },
  {
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.ts': 'CAMEL_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
    },
  },
  {
    files: ['src/**/*.test.ts'],
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    files: ['eslint-rules/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  }
);
