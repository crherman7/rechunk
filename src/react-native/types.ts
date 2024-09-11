import {Chunk} from '@crherman7/rechunk-api-client';

/**
 * Makes all properties of a type and its nested types required recursively.
 *
 * @template T - The type to make all properties required for.
 */
export type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;

/**
 * Represents a function that resolves a chunk ID to a chunk string asynchronously.
 * @param {string} chunkId - The ID of the chunk to resolve.
 * @returns {Promise<string>} A promise resolving to the chunk string.
 */
export type ResolverFunction = (
  chunkId: string,
) => Promise<DeepRequired<Chunk>>;

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

export type Configuration = {
  resolver?: ResolverFunction;
  global?: CustomRequire;
  publicKey?: string;
  verify?: boolean;
};
