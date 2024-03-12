// Importing ChunkManager class from './ChunkManager' file
import {ChunkManager} from './ChunkManager';
// Importing ResolverFunction type from '../@types' file
import {ResolverFunction} from '../@types';

/**
 * Asynchronously imports a chunk using the shared ChunkManager instance.
 * @param {string} chunkId - The ID of the chunk to import.
 * @returns {Promise<*>} A promise resolving to the imported JavaScript component.
 */
export async function importChunk(
  chunkId: string,
  publicKey: string,
  verify = true,
) {
  // Using shared ChunkManager instance to import the chunk
  return ChunkManager.shared.importChunk(chunkId, publicKey, verify);
}

/**
 * Adds a resolver function to the shared ChunkManager instance.
 * @param {ResolverFunction} resolver - The resolver function to add.
 */
export function addResolver(resolver: ResolverFunction) {
  // Using shared ChunkManager instance to add the resolver function
  ChunkManager.shared.addResolver(resolver);
}
