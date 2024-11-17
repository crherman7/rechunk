import fs from 'fs';
import ts from 'typescript';

/**
 * Applies a visitor function to the AST of a TypeScript file using the TypeScript Compiler API.
 *
 * This function reads a TypeScript file, applies the provided visitor function to its AST,
 * and writes the modified file back to the same path.
 *
 * @param {string} filePath - The path to the TypeScript file.
 * @param {(node: ts.Node) => ts.Node | undefined} visitor - The visitor function to apply to the AST.
 *
 * @example
 * ```typescript
 * import * as ts from 'typescript';
 * import { withTS } from './withTS';
 *
 * const filePath = "/path/to/my-file.ts";
 *
 * // Visitor function to add a new property to an object literal
 * const visitor = (node: ts.Node): ts.Node | undefined => {
 *   if (ts.isObjectLiteralExpression(node)) {
 *     // Create a new property
 *     const newProperty = ts.factory.createPropertyAssignment(
 *       ts.factory.createIdentifier('newProperty'),
 *       ts.factory.createStringLiteral('newValue')
 *     );
 *
 *     // Append the new property to the object literal
 *     return ts.factory.updateObjectLiteralExpression(node, [
 *       ...node.properties,
 *       newProperty,
 *     ]);
 *   }
 *   return node; // Return the original node if no transformation is applied
 * };
 *
 * // Apply the visitor function to the AST of the file
 * withTS(filePath, visitor);
 *
 * // The file at /path/to/my-file.ts will now include the added property in the object literal.
 * ```
 */
export function withTS(
  filePath: string,
  visitor: (node: ts.Node) => ts.Node | undefined,
): void {
  // Read the source file content
  const sourceText = fs.readFileSync(filePath, 'utf-8');

  // Create a source file
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );

  // Create a transformer using the visitor function
  const transformer = (context: ts.TransformationContext) => {
    const visit: ts.Visitor = node => {
      const updatedNode = visitor(node);
      return ts.visitEachChild(updatedNode || node, visit, context);
    };
    return node => ts.visitNode(node, visit);
  };

  // Apply the transformer
  const result = ts.transform(sourceFile, [transformer]);

  // Get the transformed source file
  const transformedSourceFile = result.transformed[0] as ts.SourceFile;

  // Print the modified AST back to source code
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });
  const modifiedSource = printer.printFile(transformedSourceFile);

  // Write the modified source back to the file
  fs.writeFileSync(filePath, modifiedSource, 'utf-8');
}
