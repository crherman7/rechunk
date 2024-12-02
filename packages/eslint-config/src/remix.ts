import {defineConfig} from 'eslint-define-config';

import baseConfig from './base';

export = defineConfig({
  ...baseConfig,
  extends: ['eslint:recommended'],
  ignorePatterns: [...baseConfig.ignorePatterns, '!**/.server', '!**/.client'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  overrides: [
    ...baseConfig.overrides,

    /* React */
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: ['react', 'jsx-a11y'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      settings: {
        react: {version: 'detect'},
        formComponents: ['Form'],
        linkComponents: [
          {name: 'Link', linkAttribute: 'to'},
          {name: 'NavLink', linkAttribute: 'to'},
        ],
      },
      rules: {
        ...baseConfig.rules,
        'react/prop-types': 'off',
      },
    },

    /* Typescript */
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint', 'import'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      rules: {
        ...baseConfig.rules,
      },
    },

    /* Node */
    {
      files: ['.eslintrc.cjs'],
      env: {node: true},
    },
  ],
});
