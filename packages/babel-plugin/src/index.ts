import type * as Babel from '@babel/core';
import chalk from 'chalk';
import dedent from 'dedent';
import {existsSync, readFileSync} from 'fs';
import path, {dirname, resolve} from 'path';

import {getCacheVersion, isRechunkDevServerRunning} from './lib';

/**
 * Identifier used to represent the Node.js `process` object in the plugin.
 * Typically used to identify or manipulate references to the global `process` object.
 */
const NODE_PROCESS_IDENTIFIER = 'process';

/**
 * Identifier used to represent the `process.env` object in Node.js.
 * This is often used to access environment variables within the plugin.
 */
const NODE_PROCESS_ENV_IDENTIFIER = 'env';

/**
 * Cache key used to store and retrieve the content of the `rechunk.json` file.
 * This key is used in conjunction with a caching mechanism to avoid re-reading the file.
 */
const RECHUNK_CONFIG_KEY = '@crherman7+rechunk+config+json';

/**
 * Cache key used to store and retrieve the content of the `package.json` file.
 * This key is used in conjunction with a caching mechanism to avoid re-reading the file.
 */
const RECHUNK_PACKAGE_KEY = '@crherman7+rechunk+package+json';

/**
 * An array of dependencies that should be considered as extra dependencies for the project.
 * These dependencies might need special handling or inclusion in certain processes.
 *
 * @link {https://github.com/rollup/plugins/tree/master/packages/typescript#tslib}
 */
const EXTRA_DEPENDENCIES = ['tslib'];

/**
 * The default host used by the Rechunk development server.
 */
const RECHUNK_DEV_SERVER_HOST = 'http://localhost:49904';

export default function ({types: t}: typeof Babel): Babel.PluginObj {
  /**
   * A cache that stores the content of files, keyed by their filenames.
   * This ensures that a file's content is only read once and reused on subsequent plugin runs.
   *
   * @type {Map<string, object>}
   */
  const fileCache = new Map();

  /**
   * Recursively searches for the closest JSON file, starting from a given directory.
   *
   * @param filename - The name of the JSON file to search for.
   * @param start - The directory to start searching from, defaults to the current working directory.
   * @param level - The current depth of the recursive search, used to limit recursion.
   * @returns The parsed JSON content, or an empty object if the file is not found after 10 levels.
   */
  function findClosestJSON(
    filename: string,
    start = process.cwd(),
    level = 0,
  ): any {
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
   * Retrieves and caches the JSON content for a given key. If the content is not already cached, it finds
   * the closest JSON file with the provided filename and caches the result.
   *
   * @param {string} key - The key under which the JSON content is stored in the cache.
   * @param {string} jsonFilename - The filename of the JSON file to find and cache.
   * @returns {any} The JSON content retrieved from the cache or found by the `findClosestJSON` function.
   */
  function getCachedJson(key: string, jsonFilename: string): any {
    let jsonData = fileCache.get(key);

    if (!jsonData) {
      jsonData = findClosestJSON(jsonFilename);
      fileCache.set(key, jsonData);
    }

    return jsonData;
  }

  return {
    visitor: {
      /**
       * Transforms calls to `importChunk` into dynamic imports.
       *
       * For calls to `importChunk('chunkName')`, this visitor replaces:
       *
       * ```javascript
       * lazy(() => importChunk('chunkName'));
       * ```
       *
       * With:
       *
       * ```javascript
       * lazy(() => import('../path/to/chunk'));
       * ```
       *
       * @param {Babel.NodePath<Babel.types.CallExpression>} path - Babel AST node for the `CallExpression`.
       * @param {Babel.PluginPass} state - Babel state object containing metadata like the current filename.
       */
      CallExpression(
        {node}: Babel.NodePath<Babel.types.CallExpression>,
        state: Babel.PluginPass,
      ) {
        /**
         * Environment variable that defines the server mode for the ReChunk project.
         *
         * `RECHUNK_ENVIRONMENT` controls how the project fetches and loads components, providing options for
         * remote, local, and offline modes. This flexibility allows for different loading behaviors based
         * on development needs or deployment conditions.
         *
         * Available options:
         * - **`prod`**: Uses the server configuration in `rechunk.json` to fetch components from a
         *   remote server. This mode is ideal for production or testing in an environment where a
         *   centralized server is available.
         *
         * - **`dev`**: Uses a local development server to serve components, allowing for fast,
         *   iterative development. This mode is optimized for local testing and development and
         *   expects the dev server to be running locally.
         *
         * - **`offline`**: Bypasses any server and lazily imports components directly within the app,
         *   suitable for environments where no server connection is available. This mode provides a
         *   self-contained experience by loading components without external dependencies.
         *
         * @example
         * ```typescript
         * // Set the environment variable to "prod | undefined", "dev", or "offline"
         * process.env.RECHUNK_ENVIRONMENT = "prod";
         * ```
         *
         * @remarks
         * This variable should be set before the application initializes, as it will dictate the loading
         * behavior for ReChunk components throughout the app lifecycle.
         */
        if (process.env.RECHUNK_ENVIRONMENT !== 'offline') return;

        // Ensure it's an `importChunk` call with a string literal argument
        if (
          t.isIdentifier(node.callee, {name: 'importChunk'}) &&
          t.isStringLiteral(node.arguments[0])
        ) {
          // Replace `importChunk` with `import`
          node.callee = t.import();

          // Get the current file path and project root
          const currentFilePath = state.file.opts.filename;
          const projectRoot = process.cwd();

          // Retrieve the `rechunk.json` configuration
          const rechunkJson = getCachedJson(RECHUNK_CONFIG_KEY, 'rechunk.json');
          const chunkKey = node.arguments[0].value;
          const targetFileRelativeToRoot = rechunkJson.entry[chunkKey];

          if (!targetFileRelativeToRoot) {
            throw new Error(
              chalk.yellow(dedent`\n\nChunk entry for '${chunkKey}' not found in rechunk.json.

                  This error occurs because the specified chunk key ('${chunkKey}') does not have a corresponding
                  entry in the 'entry' section of rechunk.json. Each chunk must be explicitly defined in this file
                  to be processed.

                  Steps to resolve this issue:
                  1. Open rechunk.json in the root of your project.
                  2. Verify that an entry exists for the chunk key '${chunkKey}' under the 'entry' field.
                     Example:
                     {
                       "entry": {
                         "${chunkKey}": "./path/to/your/chunk-file.ts"
                       }
                     }
                  3. If the entry is missing, add it and ensure the file path is correct and relative to the project
                     root directory.

                  For more information on configuring rechunk.json, refer to the ReChunk documentation.
                `),
            );
          }

          // Resolve the target file path
          const targetFilePath = path.join(
            projectRoot,
            targetFileRelativeToRoot,
          );

          if (!existsSync(targetFilePath)) {
            throw new Error(
              chalk.yellow(dedent`
              Error: The file for the chunk '${chunkKey}' could not be found at the expected location:
              ${targetFilePath}

              This error occurs because the specified chunk key ('${chunkKey}') does not have a corresponding
              file at the resolved path. This typically happens if:

              1. The 'entry' field in your rechunk.json is incorrect or missing for the chunk key '${chunkKey}'.
              2. The file path specified for the chunk key '${chunkKey}' is invalid or the file has been moved or deleted.
              3. The working directory of your build process has changed, causing the resolved path to be incorrect.

              To resolve this issue:
              1. Open your rechunk.json file and ensure that the 'entry' field for '${chunkKey}' points to a valid
                 file path relative to the project root.
                 Example:
                 {
                   "entry": {
                     "${chunkKey}": "./src/components/MyComponent.ts"
                   }
                 }
              2. Verify that the file exists at the specified path and is correctly named.
              3. If the file path is correct, ensure that your build process is running in the correct working directory.
                 For example, the current working directory should be the root of your project.

              For more information about configuring rechunk.json, refer to the ReChunk documentation.
            `),
            );
          }

          // Calculate the relative path from the current file to the target file
          const relativePath = path.relative(
            path.dirname(currentFilePath),
            targetFilePath,
          );

          // Update the arguments with the new relative path
          node.arguments = [t.stringLiteral(relativePath)];
        }
      },
      /**
       * Visits MemberExpression nodes and inserts the rechunk project and readKey
       * as a configuration object argument into process.env.__RECHUNK_USERNAME__
       * and process.env.__RECHUNK_PASSWORD__.
       * @param {Babel.NodePath<Babel.types.MemberExpression>} path - Babel path object.
       * @param {Babel.types.MemberExpression} path.node - The current AST node member.
       * @param {Babel.NodePath<Babel.types.Node>} path.parentPath - The parent path of the current AST node member.
       */
      MemberExpression({
        node,
        parentPath: parent,
      }: Babel.NodePath<Babel.types.MemberExpression>) {
        // Check if the MemberExpression is accessing process.env
        if (
          !t.isIdentifier(node.object, {name: NODE_PROCESS_IDENTIFIER}) ||
          !t.isIdentifier(node.property, {name: NODE_PROCESS_ENV_IDENTIFIER})
        ) {
          return;
        }
        // Ensure that the MemberExpression has a parent MemberExpression
        if (!t.isMemberExpression(parent.node)) {
          return;
        }

        const rechunkJson = getCachedJson(RECHUNK_CONFIG_KEY, 'rechunk.json');
        const packageJson = getCachedJson(RECHUNK_PACKAGE_KEY, 'package.json');

        // Destructure project and readKey used to replace process.env values
        const {host, project, readKey, publicKey} = rechunkJson;

        // Replace process.env.__RECHUNK_USERNAME__ with the rechunk project
        if (
          t.isIdentifier(parent.node.property, {
            name: '__RECHUNK_PROJECT__',
          }) &&
          !parent.parentPath?.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(project));
        }

        // Replace process.env.__RECHUNK_PASSWORD__ with the rechunk readKey
        if (
          t.isIdentifier(parent.node.property, {
            name: '__RECHUNK_READ_KEY__',
          }) &&
          !parent.parentPath?.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(readKey));
        }

        // Replace process.env.__RECHUNK_HOST__ with the rechunk host
        if (
          t.isIdentifier(parent.node.property, {
            name: '__RECHUNK_HOST__',
          }) &&
          !parent.parentPath?.isAssignmentExpression()
        ) {
          if (
            process.env.RECHUNK_ENVIRONMENT === 'prod' ||
            !process.env.RECHUNK_ENVIRONMENT
          ) {
            parent.replaceWith(t.stringLiteral(host));
          }

          if (process.env.RECHUNK_ENVIRONMENT === 'dev') {
            if (!isRechunkDevServerRunning())
              throw Error(
                chalk.yellow(dedent`\n\nRECHUNK_ENVIRONMENT is set to "dev", but no development server was detected.

                To use the "dev" environment, please ensure that the development server is running.
                You can start it by executing the following command:

                    rechunk dev-server

                If you intended to use a different environment:
                - Set RECHUNK_ENVIRONMENT to "prod" to fetch components from a remote server using 'rechunk.json'.
                - Set RECHUNK_ENVIRONMENT to "offline" to load components directly without a server connection.

                For example:
                    export RECHUNK_ENVIRONMENT="prod"   # For remote server
                    export RECHUNK_ENVIRONMENT="offline"  # For offline mode`),
              );

            parent.replaceWith(t.stringLiteral(RECHUNK_DEV_SERVER_HOST));
          }
        }

        // Replace process.env.__RECHUNK_GLOBAL__ with the rechunk host
        if (
          t.isIdentifier(parent.node.property, {
            name: '__RECHUNK_GLOBAL__',
          }) &&
          parent.parentPath?.isAssignmentExpression()
        ) {
          const external = rechunkJson.external || [];
          const dependencies = packageJson.dependencies || {};

          // Generate requireStatements for each dependency
          const requireStatements = [
            ...Object.keys(dependencies),
            ...external,
            ...EXTRA_DEPENDENCIES,
          ].map(dependency =>
            t.ifStatement(
              t.binaryExpression(
                '===',
                t.identifier('moduleId'),
                t.stringLiteral(dependency),
              ),
              t.blockStatement([
                t.returnStatement(
                  t.callExpression(t.identifier('require'), [
                    t.stringLiteral(dependency),
                  ]),
                ),
              ]),
            ),
          );

          // Create the require function expression
          const requireFunction = t.functionExpression(
            null,
            [t.identifier('moduleId')],
            t.blockStatement([
              ...requireStatements,
              t.returnStatement(t.nullLiteral()),
            ]),
          );

          parent.replaceWith(
            t.objectExpression([
              t.objectProperty(t.identifier('require'), requireFunction),
            ]),
          );
        }

        // Replace process.env.__RECHUNK_PUBLIC_KEY__ with the rechunk host
        if (
          t.isIdentifier(parent.node.property, {
            name: '__RECHUNK_PUBLIC_KEY__',
          }) &&
          parent.parentPath?.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(publicKey));
        }
      },
    },
  };
}

/**
 * Cache version string generated for the Metro Bundler.
 *
 * @remarks
 * This constant is derived by calling the `getCacheVersion` function, which generates
 * a deterministic hash based on:
 * - The last modified time of the `rechunk.json` file.
 * - The `RECHUNK_ENVIRONMENT` environment variable.
 * - The running status of the Rechunk development server.
 *
 * The cache version helps ensure that Metro uses the correct cache when bundling,
 * avoiding stale or inconsistent builds.
 *
 * @example
 * ```typescript
 * console.log(cacheVersion); // e.g., "3d94d1c0f..."
 * ```
 */
export const cacheVersion = getCacheVersion();
