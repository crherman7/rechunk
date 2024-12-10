import type * as Babel from '@babel/core';
import {ConfigAPI, template, type TransformCaller, types} from '@babel/core';
import chalk from 'chalk';
import dedent from 'dedent';
import {readFileSync} from 'fs';
import {dirname, relative, resolve} from 'path';

import {getCacheVersion, isRechunkDevServerRunning} from './lib';

/**
 * Checks if the Babel transformation is being invoked by the ReChunk bundler.
 *
 * This function examines the `caller` object to determine if the `name` property
 * matches `'rechunk'`, indicating that the current Babel transformation is being
 * executed by the ReChunk bundler.
 *
 * @param {TransformCaller} caller - The caller object provided by Babel's `api.caller` function.
 * This object typically contains metadata about the tool invoking the Babel transformation.
 *
 * @returns {boolean} Returns `true` if the `caller.name` is `'rechunk'`, otherwise `false`.
 *
 * @example
 * ```typescript
 * const isRechunkBundler = api.caller(getIsRechunkBundler);
 * if (isRechunkBundler) {
 *   console.log('Transformation is running in the ReChunk bundler');
 * }
 * ```
 */
export function getIsRechunkBundler(caller: TransformCaller): boolean {
  return caller.name === 'rechunk';
}

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
 * Cache key used to store and retrieve the content of the `.rechunkrc.json` file.
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
const EXTRA_DEPENDENCIES = ['react/jsx-runtime'];

/**
 * The default host used by the Rechunk development server.
 */
const RECHUNK_DEV_SERVER_HOST = 'http://localhost:49904';

export default function (
  api: ConfigAPI & {types: typeof types},
): Babel.PluginObj {
  const t = types;

  /**
   * Determines if the current Babel transformation is being executed by the ReChunk bundler.
   *
   * This leverages the `api.caller` function to check the calling environment's metadata.
   * The `getIsRechunkBundler` function is a callback that examines the caller object
   * to determine if the bundler is identified as ReChunk.
   *
   * @example
   * ```typescript
   * const isRechunkBundler = api.caller(getIsRechunkBundler);
   * if (isRechunkBundler) {
   *   console.log('Transforming specifically for ReChunk bundler');
   * }
   * ```
   *
   * @type {boolean | undefined}
   */
  const isRechunkBundler: boolean = api.caller(getIsRechunkBundler);

  /**
   * Determines if the current environment is set to offline mode for ReChunk.
   *
   * This checks the `RECHUNK_ENVIRONMENT` environment variable and sets `isOffline`
   * to `true` if the value is `'offline'`.
   *
   * @example
   * ```typescript
   * const isOffline = process.env.RECHUNK_ENVIRONMENT === 'offline';
   * if (isOffline) {
   *   console.log('Running in offline mode');
   * }
   * ```
   *
   * @type {boolean}
   */
  const isOffline: boolean = process.env.RECHUNK_ENVIRONMENT === 'offline';

  /**
   * A cache that stores the content of files, keyed by their filenames.
   * This ensures that a file's content is only read once and reused on subsequent plugin runs.
   *
   * @type {Map<string, object>}
   */
  const fileCache: Map<string, object> = new Map();

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
    name: 'rechunk-babel-plugin',
    visitor: {
      Program(path, state) {
        const hasUseRechunkDirective = path.node.directives.some(
          directive => directive.value.value === 'use rechunk',
        );

        const filePath = state.file.opts.filename;

        if (!filePath) {
          // This can happen in tests or systems that use Babel standalone.
          throw new Error('[Babel] Expected a filename to be set in the state');
        }

        // File starts with "use rechunk" directive.
        if (!hasUseRechunkDirective || isOffline || isRechunkBundler) {
          // Do nothing for code that isn't marked as a dom component.
          return;
        }

        let hasDefaultExport = false;
        let hasAsyncModifier = false;
        let isFunction = state.filename.match(/\.ts$/);

        path.traverse({
          ExportNamedDeclaration(path) {
            const declaration = path.node.declaration;
            if (
              t.isTypeAlias(declaration) ||
              t.isInterfaceDeclaration(declaration) ||
              t.isTSTypeAliasDeclaration(declaration) ||
              t.isTSInterfaceDeclaration(declaration)
            ) {
              // Allows type exports
              return;
            }

            throw path.buildCodeFrameError(
              chalk.red(
                dedent`\n\nError: Named exports found.

                The "use rechunk" directive requires that the module contain only a single default export.
                Having named exports is not supported and will lead to this error.

                Steps to resolve this issue:
                1. Open the file where the error occurred.
                2. Verify that only one default export is present in the module.
                   Example of a valid single default export:

                   export default function MyComponent() {
                     // Your code here
                   }

                3. If there are named exports, consolidate them into a single default or refactor your code.

                For more details on the "use rechunk" directive and export requirements, refer to the ReChunk documentation.
                `,
              ),
            );
          },
          ExportDefaultDeclaration(path) {
            const declaration = path.node.declaration;

            if (isFunction && t.isFunctionDeclaration(declaration)) {
              hasAsyncModifier = declaration.async;
            }
            hasDefaultExport = true;
          },
        });

        if (!hasDefaultExport) {
          throw path.buildCodeFrameError(
            chalk.red(
              dedent`\n\nError: Missing default export.

              The "use rechunk" directive requires the module to have a default export. Without a default export,
              the chunk cannot be processed correctly.

              Steps to resolve this issue:
              1. Open the file where the error occurred.
              2. Add a default export to the module.
                 Example of a valid default export:

                 export default function MyComponent() {
                   // Your code here
                 }

              3. Ensure there is only one default export in the file.

              For more details on the "use rechunk" directive and default export requirements, refer to the ReChunk documentation.
              `,
            ),
          );
        }

        if (isFunction && !hasAsyncModifier) {
          throw path.buildCodeFrameError(
            chalk.red(
              dedent`\n\nError: Missing async default export.

              The "use rechunk" directive in a function module requires the default export to be an async function.
              Without an async default export, the chunk cannot be processed correctly.

              Steps to resolve this issue:
              1. Open the file where the error occurred.
              2. Ensure the default export is an async function.
                 Example of a valid async default export:

                 export default async function loadChunk() {
                   // Your async code here
                 }

              3. Ensure there is only one default export in the file and that it includes the 'async' keyword.

              For more details on the "use rechunk" directive and async default export requirements, refer to the ReChunk documentation.
              `,
            ),
          );
        }

        path.traverse({
          ImportDeclaration(path) {
            path.remove();
          },
        });
        path.node.body = [];
        path.node.directives = [];

        let relativePath = relative(process.cwd(), state.filename);

        if (!relativePath.startsWith('.')) {
          relativePath = `./${relativePath}`;
        }

        const bufferObj = Buffer.from(relativePath, 'utf8');
        const base64String = bufferObj.toString('base64');

        // Create template with declaration first
        const rechunkComponentTemplate = `
          import React from 'react';
          import {importChunk} from '@crherman7/rechunk';

          const $$ReChunkModule = React.lazy(() => importChunk('${base64String}'));

          export default $$ReChunkModule;
        `;

        const rechunkFunctionTemplate = `
          import { importChunk } from '@crherman7/rechunk';

          const chunkLoader = importChunk('${base64String}');

          async function $$ReChunkModule(...args) {
            return chunkLoader.then(module => {
              return module.default(...args);
            });
          }

          export default $$ReChunkModule;
          `;

        // Convert template to AST and push to body
        const ast = template.ast(
          isFunction ? rechunkFunctionTemplate : rechunkComponentTemplate,
        );
        const results = path.pushContainer('body', ast);

        // Find and register the component declaration
        results.forEach(nodePath => {
          if (
            t.isVariableDeclaration(nodePath.node) &&
            nodePath.node.declarations[0]?.id &&
            'name' in nodePath.node.declarations[0].id &&
            nodePath.node.declarations[0].id.name === '$$ReChunkModule'
          ) {
            path.scope.registerDeclaration(nodePath);
          }
        });
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
        buildCodeFrameError,
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

        const rechunkJson = getCachedJson(
          RECHUNK_CONFIG_KEY,
          '.rechunkrc.json',
        );
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
              throw buildCodeFrameError(
                chalk.red(dedent`\n\nRECHUNK_ENVIRONMENT is set to "dev", but no development server was detected.

                To use the "dev" environment, please ensure that the development server is running.
                You can start it by executing the following command:

                    rechunk dev-server

                If you intended to use a different environment:
                - Set RECHUNK_ENVIRONMENT to "prod" to fetch components from a remote server using '.rechunkrc.json'.
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
              t.objectProperty(t.identifier('global'), t.identifier('global')),
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
 * - The last modified time of the `.rechunkrc.json` file.
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
