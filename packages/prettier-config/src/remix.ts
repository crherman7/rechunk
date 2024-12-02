import {type Options} from 'prettier';

import baseConfig from './base';

export = {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx'],
} satisfies Options;
