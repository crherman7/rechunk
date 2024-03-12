/**
 * Asynchronously imports a chunk using the shared ChunkManager instance.
 * This function is exported as 'importChunk'.
 * @param {string} chunkId - The ID of the chunk to import.
 * @returns {Promise<*>} A promise resolving to the imported JavaScript component.
 */
export {importChunk} from './lib';

/**
 * Adds a resolver function to the shared ChunkManager instance.
 * This function is exported as 'addResolver'.
 * @param {ResolverFunction} resolver - The resolver function to add.
 */
export {addResolver} from './lib';
