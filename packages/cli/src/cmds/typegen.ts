import {program} from 'commander';
import ts from 'typescript';

import {
  getRechunkConfig,
  LOGO,
  resolveDeclarationFilePathFromPackage,
  withTS,
} from '../lib';

/**
 * The name of the ReChunk package used for resolving paths and fetching its configuration.
 *
 * This constant is used throughout the codebase to refer to the ReChunk package. It ensures
 * consistency when accessing the package's metadata, such as its `package.json`, TypeScript
 * declaration files, and other related assets.
 *
 * @example
 * Resolving the `package.json` for ReChunk:
 * ```typescript
 * const packageJsonPath = require.resolve(`${RECHUNK_PACKAGE}/package.json`, {
 *   paths: [process.cwd()],
 * });
 * ```
 */
const RECHUNK_PACKAGE = '@crherman7/rechunk';

/**
 * Registers the `typegen` command to the `commander` CLI.
 *
 * The `typegen` command dynamically updates the `ReChunkEntries` type in the ReChunk
 * library to reflect the latest entries from the `rechunk.json` configuration file. This
 * ensures that the `importChunk` function accepts only the current valid chunk IDs.
 *
 * The updated type definitions are written to the `index.d.ts` file of the ReChunk library,
 * keeping the typings consistent with the server-side configuration.
 *
 * @example
 * Running the command via the CLI:
 * ```bash
 * yarn rechunk typegen
 * ```
 *
 * Expected Behavior:
 * - Reads the `rechunk.json` configuration to get the list of valid chunk entries.
 * - Updates the `ReChunkEntries` type in the TypeScript declaration file (`index.d.ts`).
 * - Ensures type safety and alignment between server-side configuration and client usage.
 *
 * @see {@link https://github.com/tj/commander.js} for more about the Commander.js library.
 */
program
  .command('typegen')
  .description('Update importChunk accepted chunks')
  .action(async () => {
    console.log();
    console.log(LOGO);
    console.log('🚀 Starting ReChunk Type Generation...`');

    try {
      // Fetch the ReChunk configuration
      console.log('📄 Loading configuration from `rechunk.json`...');
      const rc = getRechunkConfig();

      const rechunkDeclarationFilePath =
        resolveDeclarationFilePathFromPackage(RECHUNK_PACKAGE);

      console.log(
        `📁 Resolved type definitions path: ${rechunkDeclarationFilePath}`,
      );

      // Use withTS to update the ReChunkEntries type
      console.log('🔍 Searching for `ReChunkEntries` type...');
      withTS(
        rechunkDeclarationFilePath,
        (node: ts.Node): ts.Node | undefined => {
          if (
            ts.isTypeAliasDeclaration(node) &&
            node.name.text === 'ReChunkEntries'
          ) {
            console.log('✅ Found `ReChunkEntries` type. Updating...');

            // Replace the type definition with the union of valid chunk entries
            return ts.factory.updateTypeAliasDeclaration(
              node,
              node.modifiers,
              node.name,
              node.typeParameters,
              ts.factory.createUnionTypeNode(
                Object.keys(rc.entry).map(entry =>
                  ts.factory.createLiteralTypeNode(
                    ts.factory.createStringLiteral(entry),
                  ),
                ),
              ),
            );
          }

          return undefined; // Return undefined for unmodified nodes
        },
      );

      console.log('✨ Type definitions successfully updated! 🎉');
    } catch (error) {
      console.error('❌ Failed to update type definitions:', error);
    }
  });
