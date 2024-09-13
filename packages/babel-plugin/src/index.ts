import type * as Babel from '@babel/core';
import {readFileSync} from 'fs';
import {dirname, resolve} from 'path';
import {cwd} from 'process';

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
       * Visits MemberExpression nodes and inserts the rechunk project and readKey
       * as a configuration object argument into process.env.__RECHUNK_USERNAME__
       * and process.env.__RECHUNK_PASSWORD__.
       * @param {Babel.NodePath<Babel.types.MemberExpression>} path - Babel path object.
       * @param {Babel.types.MemberExpression} path.node - The current AST node member.
       * @param {Babel.NodePath<Babel.types.Node>} path.parentPath - The parent path of the current AST node member.
       */
      MemberExpression({node, parentPath: parent}) {
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
          parent.replaceWith(t.stringLiteral(host));
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
