import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import next from '@next/eslint-plugin-next';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.config({}),
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error'
    }
  },

  {
    plugins: { '@next/next': next },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off'
    }
  },
  {
    languageOptions: {
      globals: globals.builtin,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    },
    plugins: { unicorn: eslintPluginUnicorn, react },
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
        },
        {
          selector: "IfStatement[consequent.type!='BlockStatement']",
          message:
            'If statements should not be on the same line. Use a block statement for clarity.'
        }
      ],
      'linebreak-style': ['error', 'unix'],
      semi: [2, 'always'],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase'
        }
      ],
      'unicorn/no-null': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'warn',
      'unicorn/no-await-expression-member': 'warn',
      'no-cond-assign': 'warn',
      'no-useless-catch': 'warn',
      'no-useless-escape': 'warn',
      'no-unreachable': 'warn',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
      '@typescript-eslint/require-array-sort-compare': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-regexp-exec': 'warn',
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ],
      '@typescript-eslint/no-type-alias': [
        'warn',
        {
          allowAliases: 'in-unions-and-intersections',
          allowCallbacks: 'always',
          allowConditionalTypes: 'always',
          allowConstructors: 'always',
          allowLiterals: 'always',
          allowMappedTypes: 'always',
          allowTupleTypes: 'always',
          allowGenerics: 'always'
        }
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports'
        }
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        {
          ignoreTernaryTests: false,
          allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/jsx-curly-brace-presence': 'error',
      'react/jsx-curly-spacing': [
        'error',
        'never',
        {
          allowMultiline: true
        }
      ]
    }
  }
];

export default eslintConfig;
