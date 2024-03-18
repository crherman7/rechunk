// Importing ChunkManager class from './ChunkManager' file
import {ChunkManager} from './ChunkManager';
// Importing ResolverFunction type from '../@types' file
import type {ResolverFunction} from './types';

/**
 * Asynchronously imports a chunk using the shared ChunkManager instance.
 * @param {string} chunkId - The ID of the chunk to import.
 * @returns {Promise<*>} A promise resolving to the imported JavaScript component.
 */
export async function importChunk(chunkId: string): Promise<any> {
  // Using shared ChunkManager instance to import the chunk
  return ChunkManager.shared.importChunk(chunkId);
}

/**
 * Adds configuration settings to the ChunkManager.
 * This function is used to configure the ChunkManager with specified settings such as public key, resolver function, verification flag, and global object.
 * @param {ResolverFunction} resolver - The resolver function used to resolve chunk imports.
 * @param {boolean} verify - Flag indicating whether verification is enabled.
 * @param {object} global - Object representing protected global variables and functions.
 */
function addConfiguration(
  resolver: ResolverFunction,
  verify: boolean,
  global: object = {},
) {
  // Delegates the configuration addition to the shared instance of ChunkManager
  ChunkManager.shared.addConfiguration(resolver, verify, global);
}

/**
 * Type-guards the configuration for Re.Chunk.
 * @param {ChunkConfig} config - The config to guard.
 * @returns {ChunkConfig} A type-guarded Re.Chunk configuration.
 */
export {defineConfig} from './config';

/**
 * Exports the addResolver function under the default namespace,
 * making it accessible under the ReChunk namespace.
 */
export default {
  addConfiguration,
};

export * from './types';
