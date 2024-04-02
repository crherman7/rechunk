const path = require('path');

/**
 * Babel plugin for dynamically generating a require function based on dependencies listed in package.json
 * and inserting it as a configuration object argument into ReChunk.addConfiguration(false, config).
 * @param {object} api - Babel plugin API object.
 * @param {object} options - Options passed to the plugin.
 * @returns {object} Babel visitor.
 */
module.exports = function rechunkPlugin({types: t}) {
  return {
    visitor: {
      /**
       * Visits CallExpression nodes and inserts the dynamically generated require function
       * as a configuration object argument into ReChunk.addConfiguration(false, config).
       * @param {object} path - Babel path object.
       */
      CallExpression(p) {
        // Check if the CallExpression is ReChunk.addConfiguration(false)
        if (
          p.get('callee').isMemberExpression() &&
          p.get('callee.object').isIdentifier({name: 'ReChunk'}) &&
          p.get('callee.property').isIdentifier({name: 'addConfiguration'})
        ) {
          // Resolve the path to package.json
          const packageJsonPath = path.resolve(process.cwd(), 'package.json');
          // Read package.json to get dependencies
          const packageJson = require(packageJsonPath);

          // Resolve the path to rechunk.json
          const rechunkConfigJsonPath = path.resolve(
            process.cwd(),
            'rechunk.json',
          );
          // Read rechunk.json to get external
          const rechunkConfigJson = require(rechunkConfigJsonPath);

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

        // Resolve the path to rechunk.json
        const rechunkConfigJsonPath = path.resolve(
          process.cwd(),
          'rechunk.json',
        );
        // Read rechunk.json to get external
        const rechunkConfigJson = require(rechunkConfigJsonPath);

        // Destructure project and readKey used to replace process.env values
        const {project, readKey} = rechunkConfigJson;

        // Replace process.env.RECHUNK_USERNAME with the rechunk project
        if (
          t.isIdentifier(parent.node.property, {
            name: 'RECHUNK_PROJECT',
          }) &&
          !parent.parentPath.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(project));
        }

        // Replace process.env.RECHUNK_PASSWORD with the rechunk readKey
        if (
          t.isIdentifier(parent.node.property, {
            name: 'RECHUNK_READ_KEY',
          }) &&
          !parent.parentPath.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(readKey));
        }
      },
    },
  };
};
