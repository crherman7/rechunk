import {Chunk} from '@crherman7/rechunk-api-client';

/**
 * Represents the valid entries for chunks in the `importChunk` function.
 *
 * This type is updated dynamically during the `typegen` command execution.
 * Initially, it is set to `null`, but it will be replaced with a union type of valid chunk names
 * (e.g., `'card' | 'home' | 'stack'`).
 *
 * @example
 * ```typescript
 * type ReChunkEntries = 'card' | 'home' | 'stack';
 * ```
 */
export type ReChunkEntries = null;

/**
 * Validates if a given chunk ID is part of the recognized `ReChunkEntries`.
 *
 * If the chunk ID is not valid, it produces a detailed error message prompting
 * the user to regenerate types using the `typegen` command.
 *
 * @template T - The chunk ID to validate.
 * @example
 * ```typescript
 * type ValidChunk = ValidateReChunkEntry<'card'>; // Resolves to 'card'
 * type InvalidChunk = ValidateReChunkEntry<'invalid'>;
 * // Resolves to:
 * // "Invalid ReChunk entry: 'invalid' is not a recognized chunk ID. Please regenerate types using the `typegen` command."
 * ```
 */
export type ValidateReChunkEntry<T extends string> = T extends ReChunkEntries
  ? T
  : `Invalid ReChunk entry: '${T}' is not a recognized chunk ID. Please ensure the chunk ID exists in the rechunk.json configuration file and regenerate types using the \`typegen\` command.`;

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
