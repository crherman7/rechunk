import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {cwd} from 'node:process';

import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import {RollupOptions} from 'rollup';

/**
 * Babel overrides to disable specific plugins for compatibility with Rollup.
 *
 * Rollup relies on ES6 module syntax (`import`/`export`) to perform tree-shaking
 * and bundling optimizations. However, some Babel plugins, like `@babel/plugin-transform-modules-commonjs`,
 * convert ES6 modules to CommonJS (`require`/`module.exports`). This transformation
 * interferes with Rollup's ability to optimize and bundle the code effectively.
 *
 * By disabling such plugins (e.g., `module-resolver`), we ensure that ES6 module
 * syntax remains intact, allowing Rollup to handle the module bundling correctly.
 *
 * @constant
 * @example
 * ```typescript
 * import babel from '@rollup/plugin-babel';
 * import { BABEL_ROLLUP_OVERRIDES } from './babelOverrides';
 *
 * export default {
 *   plugins: [
 *     babel({
 *       ...BABEL_ROLLUP_OVERRIDES,
 *     }),
 *   ],
 * };
 * ```
 */
export const BABEL_ROLLUP_OVERRIDES = {
  overrides: [
    {
      plugins: [
        // Disable `module-resolver` to prevent module transformation conflicts with Rollup
        ['module-resolver', false],
      ],
    },
  ],
};

/**
 * Recursively searches for the closest JSON file, starting from a given directory.
 *
 * @param filename - The name of the JSON file to search for.
 * @param start - The directory to start searching from, defaults to the current working directory.
 * @param level - The current depth of the recursive search, used to limit recursion.
 * @returns The parsed JSON content, or an empty object if the file is not found after 10 levels.
 */
function findClosestJSON(filename: string, start = cwd(), level = 0): any {
  try {
    const path = resolve(start, filename);
    const content = readFileSync(path, {encoding: 'utf8'});
    return JSON.parse(content);
  } catch {
    // Limit recursion to 10 levels to prevent potential infinite loops
    return level >= 10
      ? {}
      : findClosestJSON(filename, dirname(start), level + 1);
  }
}

/**
 * Processes the given Rollup options, merging them with default configurations.
 *
 * This function reads the project's `package.json` and `.rechunkrc.json` files to determine
 * external dependencies and entry points, and applies Babel and TypeScript plugins.
 *
 * @param options - The Rollup configuration options to process.
 * @returns The processed Rollup configuration, fully merged with default settings.
 * @throws If `options.input` is not provided as a string, an error is thrown.
 */
async function processOptions(options: RollupOptions) {
  const pkgJSON = findClosestJSON('package.json');
  const rechunkJSON = findClosestJSON('.rechunkrc.json');

  const external = [
    ...Object.keys(pkgJSON.dependencies || {}),
    ...Object.keys(pkgJSON.peerDependencies || {}),
    ...(rechunkJSON.external || []),
  ];

  // Ensure that the input option is a string, as required by rechunk
  if (typeof options.input !== 'string') {
    throw new Error('rechunk rollup-preset requires options.input as a string');
  }

  // Define the default Rollup options with plugins for images, TypeScript, and Babel
  const defaultOptions = {
    external,
    plugins: [
      babel({
        filename: options.input,
        caller: {
          name: 'rechunk',
        },
        babelHelpers: 'bundled',
        extensions: ['.ts', '.tsx'],
        exclude: 'node_modules/**',
        ...BABEL_ROLLUP_OVERRIDES,
      }),
      image(),
    ],
    logLevel: 'silent',
  } satisfies RollupOptions;

  const {mergeAndConcat} = await import('merge-anything');

  return mergeAndConcat(options, defaultOptions) as RollupOptions;
}

/**
 * A Rollup preset function that extends the provided options with a default configuration.
 *
 * This preset processes single or multiple Rollup configuration objects, applying the
 * `processOptions` function to each.
 *
 * @param options - The Rollup configuration or array of configurations to extend.
 * @returns A fully configured Rollup configuration or an array of configurations.
 */
export default function withRechunk(options: RollupOptions = {}) {
  return processOptions(options);
}
