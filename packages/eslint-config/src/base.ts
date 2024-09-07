import {resolve} from 'node:path';

import {defineConfig} from 'eslint-define-config';

export = defineConfig({
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['simple-import-sort', 'prettier', 'only-warn'],
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: resolve(process.cwd(), 'tsconfig.json'),
      },
    },
  },
  overrides: [
    {
      files: ['*.js?(x)', '*.ts?(x)'],
    },
  ],
  ignorePatterns: ['node_modules/', 'dist/', '__tests__/'],
  rules: {
    /*
     * base
     * */
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',

    /*
     * imports
     * */
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
});
