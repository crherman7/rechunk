import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'fs';
import {glob} from 'glob';
import {dirname, join, relative, resolve} from 'path';

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
  const declarationFilePath = resolve(dirname(packageJsonPath), typesPath);

  if (!fs.existsSync(declarationFilePath)) {
    throw new Error(
      `Declaration file not found at resolved path: ${declarationFilePath}`,
    );
  }

  return declarationFilePath;
}

/**
 * Recursively finds all `.tsx` files in the specified directory.
 *
 * @param dir - The root directory to search in.
 * @returns A promise resolving to an array of `.tsx` file paths.
 */
async function findTSAndTSXFiles(dir: string): Promise<string[]> {
  const globPattern = join(dir, '**/*.{ts,tsx}');
  const ignorePattern = '**/node_modules/**';

  return glob(globPattern, {ignore: ignorePattern});
}

/**
 * Checks if a given file contains the `"use rechunk"` directive by parsing its AST.
 *
 * @param filePath - The path of the `.tsx` file to check.
 * @returns A promise resolving to `true` if the file contains the directive, otherwise `false`.
 */
async function containsUseRechunkDirective(filePath: string): Promise<boolean> {
  try {
    const code = await fs.promises.readFile(filePath, 'utf-8');
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    let hasUseDomDirective = false;

    traverse(ast, {
      Directive(path) {
        if (path.node.value.value === 'use rechunk') {
          hasUseDomDirective = true;
          path.stop(); // Stop traversal once found
        }
      },
    });

    return hasUseDomDirective;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

/**
 * Aggregates all `.tsx` files in the project that contain the `"use rechunk"` directive.
 *
 * @param rootDir - The root directory of the project.
 * @returns A promise resolving to an array of file paths containing the `"use rechunk"` directive.
 * @example
 * ```typescript
 * aggregateUseDomFiles('/path/to/project').then(files => console.log(files));
 * ```
 */
export async function aggregateUseRechunkFiles(
  rootDir: string,
): Promise<string[]> {
  const files = await findTSAndTSXFiles(rootDir);
  const matchingFiles: string[] = [];

  for (const file of files) {
    if (await containsUseRechunkDirective(file)) {
      let relativePath = relative(process.cwd(), file);

      if (!relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`;
      }

      matchingFiles.push(relativePath);
    }
  }

  return matchingFiles;
}
