/**
 * Represents a function that resolves a chunk ID to a chunk string asynchronously.
 * @param {string} chunkId - The ID of the chunk to resolve.
 * @returns {Promise<string>} A promise resolving to the chunk string.
 */
export type ResolverFunction = (chunkId: string) => Promise<string>;
