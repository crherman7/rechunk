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
  privateKeyPath: string;
};

/**
 * Represents an interface for a custom require function to control module access.
 */
export type CustomRequire = {
  /**
   * Custom implementation of require function to control module access.
   * @param {string} moduleId - The ID of the module to be required.
   * @returns {Object|null} - The required module if allowed, otherwise null.
   * @protected
   */
  require: RequireFunction<string>;
};

/**
 * Represents a function signature for a custom require function.
 * @template T - The type of module ID.
 */
type RequireFunction<T extends string> = (moduleId: T) => object | null;
