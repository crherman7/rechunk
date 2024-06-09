import type * as Babel from '@babel/core';

import {getPackageJson, getRechunkConfig} from '../cli/lib/config';

export default function ({types: t}: typeof Babel): Babel.PluginObj {
  return {
    visitor: {
      /**
       * Visits MemberExpression nodes and inserts the rechunk project and readKey
       * as a configuration object argument into process.env.RECHUNK_USERNAME
       * and process.env.RECHUNK_PASSWORD.
       * @param {object} path - Babel path object.
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
      ClassDeclaration({node}) {
        if (t.isIdentifier(node.id, {name: 'ChunkManager'})) {
          const {body} = node.body;

          const packageJson = getPackageJson();
          const rechunkConfigJson = getRechunkConfig();

          body.forEach(property => {
            if (t.isClassProperty(property) && t.isIdentifier(property.key)) {
              if (property.key.name === 'publicKey') {
                property.value = t.stringLiteral(rechunkConfigJson.publicKey);
              }

              if (property.key.name === 'global') {
                const external = rechunkConfigJson.external || [];
                const dependencies = packageJson.dependencies || {};

                // Generate requireStatements for each dependency
                const requireStatements = [
                  ...Object.keys(dependencies),
                  ...external,
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

                property.value = t.objectExpression([
                  t.objectProperty(t.identifier('require'), requireFunction),
                ]);
              }
            }
          });
        }
      },
    },
  };
}
