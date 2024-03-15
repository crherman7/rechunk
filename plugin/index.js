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
          const dependencies = packageJson.dependencies || {};

          // Generate requireStatements for each dependency
          const requireStatements = Object.keys(dependencies).map(
            dependency => {
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
            },
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

          // Add the configuration object as a second argument to ReChunk.addConfiguration
          p.node.arguments.push(
            t.objectExpression([
              t.objectProperty(t.identifier('require'), requireFunction),
            ]),
          );
        }
      },
    },
  };
};
