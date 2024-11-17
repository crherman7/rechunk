import fs from 'fs';
import path from 'path';

/**
 * Resolves the path to the TypeScript declaration file (`index.d.ts`) for the given package
 * by reading the `types` or `typings` field from its `package.json`.
 *
 * @param packageName - The name of the package whose declaration file path needs to be resolved.
 * @returns The resolved path to the declaration file.
 * @throws An error if the package or the declaration file cannot be found.
 */
export function resolveDeclarationFilePathFromPackage(
  packageName: string,
): string {
  // Resolve the package.json path
  const packageJsonPath = require.resolve(`${packageName}/package.json`, {
    paths: [process.cwd()],
  });

  // Read and parse the package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // Look for `types` or `typings` in the package.json
  const typesPath = packageJson.types || packageJson.typings;

  if (!typesPath) {
    throw new Error(
      `The package.json for ${packageName} does not specify a 'types' or 'typings' field.`,
    );
  }

  // Resolve the types path relative to the package.json location
  const declarationFilePath = path.resolve(
    path.dirname(packageJsonPath),
    typesPath,
  );

  if (!fs.existsSync(declarationFilePath)) {
    throw new Error(
      `Declaration file not found at resolved path: ${declarationFilePath}`,
    );
  }

  return declarationFilePath;
}
