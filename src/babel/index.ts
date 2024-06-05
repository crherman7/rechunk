import type * as Babel from '@babel/core';

import {getPackageJson, getRechunkConfig} from '../cli/lib/config';

export default function ({types: t}: typeof Babel): Babel.PluginObj {
  return {
    visitor: {
      CallExpression(p) {
        // Check if the CallExpression is ReChunk.addConfiguration(false)
        if (
          p.get('callee').isMemberExpression() &&
          (
            p.get('callee.object') as Babel.NodePath<
              Babel.types.V8IntrinsicIdentifier | Babel.types.Expression
            >
          ).isIdentifier({name: 'ReChunk'}) &&
          (
            p.get('callee.property') as Babel.NodePath<
              Babel.types.V8IntrinsicIdentifier | Babel.types.Expression
            >
          ).isIdentifier({name: 'addConfiguration'})
        ) {
          const packageJson = getPackageJson();
          const rechunkConfigJson = getRechunkConfig();

          const external = rechunkConfigJson.external || [];
          const dependencies = packageJson.dependencies || {};

          // Generate requireStatements for each dependency
          const requireStatements = [
            ...Object.keys(dependencies),
            ...external,
          ].map(dependency => {
            return t.ifStatement(
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
            );
          });

          // Create the require function expression
          const requireFunction = t.functionExpression(
            null,
            [t.identifier('moduleId')],
            t.blockStatement([
              ...requireStatements,
              t.returnStatement(t.nullLiteral()),
            ]),
          );

          // Add the configuration object as a second argument to ReChunk.addConfiguration
          p.node.arguments.push(
            t.objectExpression([
              t.objectProperty(t.identifier('require'), requireFunction),
            ]),
          );
        }
      },
      /**
       * Visits MemberExpression nodes and inserts the rechunk project and readKey
       * as a configuration object argument into process.env.RECHUNK_USERNAME
       * and process.env.RECHUNK_PASSWORD.
       * @param {object} path - Babel path object.
       */
      MemberExpression(p) {
        // Check if the MemberExpression is accessing process.env
        if (
          !t.isIdentifier(p.node.object, {name: 'process'}) ||
          !t.isIdentifier(p.node.property, {name: 'env'})
        ) {
          return;
        }

        const parent = p.parentPath;

        // Ensure that the MemberExpression has a parent MemberExpression
        if (!t.isMemberExpression(parent.node)) {
          return;
        }

        // Read rechunk.json to get external
        const rechunkConfigJson = getRechunkConfig();

        // Destructure project and readKey used to replace process.env values
        const {host, project, readKey} = rechunkConfigJson;

        // Replace process.env.RECHUNK_USERNAME with the rechunk project
        if (
          t.isIdentifier(parent.node.property, {
            name: 'RECHUNK_PROJECT',
          }) &&
          !parent.parentPath?.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(project));
        }

        // Replace process.env.RECHUNK_PASSWORD with the rechunk readKey
        if (
          t.isIdentifier(parent.node.property, {
            name: 'RECHUNK_READ_KEY',
          }) &&
          !parent.parentPath?.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(readKey));
        }

        // Replace process.env.RECHUNK_HOST with the rechunk host
        if (
          t.isIdentifier(parent.node.property, {
            name: 'RECHUNK_HOST',
          }) &&
          !parent.parentPath?.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(host));
        }
      },
    },
  };
}