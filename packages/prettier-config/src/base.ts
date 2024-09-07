import {type Options} from 'prettier';

export = {
  semi: true,
  singleQuote: true,

  tabWidth: 2,
  printWidth: 80,

  bracketSameLine: true,
  bracketSpacing: false,

  jsxSingleQuote: false,

  arrowParens: 'avoid',
  trailingComma: 'all',
} satisfies Options;
