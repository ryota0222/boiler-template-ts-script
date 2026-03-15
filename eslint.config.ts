import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

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
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'coverage/', '*.config.ts'],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
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
      'func-style': ['error', 'expression'],
      'max-params': ['error', { max: 1 }],
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
    files: ['src/**/*.test.ts'],
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  }
);
