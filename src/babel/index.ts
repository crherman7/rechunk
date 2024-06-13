import type * as Babel from '@babel/core';

import {getPackageJson, getRechunkConfig} from '../cli/lib/config';

export default function ({types: t}: typeof Babel): Babel.PluginObj {
  return {
    visitor: {
      /**
       * Visits MemberExpression nodes and inserts the rechunk project and readKey
       * as a configuration object argument into process.env.RECHUNK_USERNAME
       * and process.env.RECHUNK_PASSWORD.
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
      /**
       * Visits ClassDeclaration nodes and updates the ChunkManager class
       * for adding default configurations such as publicKey and custom require function.
       * @param {Babel.NodePath<Babel.types.MemberExpression>} path - Babel path object.
       * @param {Babel.types.ClassDeclaration} path.node - The current AST node member.
       * @param {Babel.NodePath[traverse]} path.traverse - The method that navigates by AST to process node types using visitor functions
       */
      ClassDeclaration({node, traverse}) {
        if (t.isIdentifier(node.id, {name: 'ChunkManager'})) {
          const packageJson = getPackageJson();
          const rechunkConfigJson = getRechunkConfig();

          traverse({
            ClassProperty(property) {
              const classKey = property.node.key;

              if (t.isIdentifier(classKey)) {
                if (classKey.name === 'publicKey') {
                  property
                    .get('value')
                    .replaceWith(t.stringLiteral(rechunkConfigJson.publicKey));
                }

                if (classKey.name === 'global') {
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

                  property
                    .get('value')
                    .replaceWith(
                      t.objectExpression([
                        t.objectProperty(
                          t.identifier('require'),
                          requireFunction,
                        ),
                      ]),
                    );
                }
              }
            },
          });
        }
      },
    },
  };
}
