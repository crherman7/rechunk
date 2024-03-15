const path = require('path');

module.exports = function rechunkPlugin({types: t}) {
  return {
    visitor: {
      CallExpression(p) {
        if (
          p.get('callee').isMemberExpression() &&
          p.get('callee.object').isIdentifier({name: 'ReChunk'}) &&
          p.get('callee.property').isIdentifier({name: 'addConfiguration'})
        ) {
          const packageJsonPath = path.resolve(process.cwd(), 'package.json');
          const packageJson = require(packageJsonPath);
          const dependencies = packageJson.dependencies || {};

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

          const requireFunction = t.functionExpression(
            null,
            [t.identifier('moduleId')],
            t.blockStatement([
              ...requireStatements,
              t.returnStatement(t.nullLiteral()),
            ]),
          );

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
