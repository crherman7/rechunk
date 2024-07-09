import type * as Babel from '@babel/core';

import {getPackageJson, getRechunkConfig} from '../cli/lib/config';

export default function ({types: t}: typeof Babel): Babel.PluginObj {
  // Read rechunk.json to get external
  const rechunkConfigJson = getRechunkConfig();

  // Read package.json to get dependencies
  const packageJson = getPackageJson();

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
          !t.isIdentifier(node.object, {name: 'process'}) ||
          !t.isIdentifier(node.property, {name: 'env'})
        ) {
          return;
        }
        // Ensure that the MemberExpression has a parent MemberExpression
        if (!t.isMemberExpression(parent.node)) {
          return;
        }

        // Destructure project and readKey used to replace process.env values
        const {host, project, readKey, publicKey} = rechunkConfigJson;

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
          const external = rechunkConfigJson.external || [];
          const dependencies = packageJson.dependencies || {};

          // Generate requireStatements for each dependency
          const requireStatements = [
            ...Object.keys(dependencies),
            ...external,
            'tslib',
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
