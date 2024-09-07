import {defineConfig} from 'eslint-define-config';

import baseConfig from './base';

export = defineConfig({
  ...baseConfig,
  extends: '@react-native',
  globals: {
    React: 'readonly',
    JSX: 'readonly',
  },
});
