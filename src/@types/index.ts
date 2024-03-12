/**
 * Represents a function that resolves a chunk ID to a chunk string asynchronously.
 * @param {string} chunkId - The ID of the chunk to resolve.
 * @returns {Promise<string>} A promise resolving to the chunk string.
 */
export type ResolverFunction = (chunkId: string) => Promise<string>;

/**
 * Represents the configuration object for chunks.
 * @typedef {Object} ChunkConfig
 * @property {Record<string, string>} entry - The entry points of the chunks, where keys represent chunk names and values represent entry file paths.
 */
export type ChunkConfig = {
  entry: Record<string, string>;
};
