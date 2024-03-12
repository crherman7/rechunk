// Importing necessary modules and types
import warning from 'tiny-warning';
import invariant from 'tiny-invariant';
import {NativeModules} from 'react-native';

import type {ResolverFunction} from '../@types';

/**
 * Manager class for handling chunk imports and caching.
 */
export class ChunkManager {
  // Static instance of ChunkManager
  protected static instance: ChunkManager;
  // Cache to store imported chunks
  protected cache: Record<string, React.ComponentType<any>> = {};
  // Resolver function to resolve chunk imports
  protected resolver: ResolverFunction = async function () {
    // Default resolver function throws error
    throw new Error(
      'rechunk resolver was not added.' +
        (__DEV__ ? ' Did you forget to addResolver?' : ''),
    );
  };

  /**
   * Get the shared instance of ChunkManager.
   * @returns {ChunkManager} The shared instance of ChunkManager.
   */
  static get shared(): ChunkManager {
    if (!ChunkManager.instance) {
      ChunkManager.instance = new ChunkManager();
    }

    return ChunkManager.instance;
  }

  /**
   * Creates an instance of ChunkManager.
   * @param {Object} nativeChunkManager - Native chunk manager module.
   * @throws {Error} Throws error if instance is already created or if native chunk manager module is not found.
   */
  protected constructor(
    private nativeChunkManager = NativeModules.ChunkManager,
  ) {
    // Ensure only one instance of ChunkManager is created
    if (ChunkManager.instance) {
      throw new Error(
        'ChunkManager was already instantiated. Use ChunkManager.shared instead.',
      );
    }

    // Throw error if nativeChunkManager is not found
    invariant(
      nativeChunkManager,
      'rechunk react-native module was not found.' +
        (__DEV__ ? ' Did you forget to update native dependencies?' : ''),
    );
  }

  /**
   * Converts chunk string to a JavaScript component.
   * @param {string} chunkId - The chunk identifier.
   * @param {string} chunk - The chunk string.
   * @returns {*} The JavaScript component generated from the chunk.
   */
  protected chunkToComponent(
    chunkId: string,
    chunk: string,
    global: object,
  ): React.ComponentType<any> {
    const exports = {};

    const Component = new Function(
      '__rechunk__',
      'exports',
      `${Object.keys(global)
        .map(key => `var ${key} = __rechunk__.${key};`)
        .join('\n')}; ${chunk}; return exports.default;`,
    )(...[global, exports]);

    this.cache[chunkId] = Component;

    return Component;
  }

  /**
   * Adds a resolver function to resolve chunk imports.
   * @param {ResolverFunction} resolver - The resolver function.
   */
  addResolver(resolver: ResolverFunction) {
    this.resolver = resolver;
  }

  /**
   * Imports a chunk asynchronously and returns the corresponding JavaScript component.
   * @param {string} chunkId - The ID of the chunk to import.
   * @param {string} publicKey - The public key for verifying the chunk.
   * @param {boolean} verify - Indicates whether to verify the chunk.
   * @returns {Promise<*>} A promise resolving to the JavaScript component imported from the chunk.
   */
  async importChunk(
    chunkId: string,
    publicKey: string,
    verify: boolean,
    global = {
      require: (moduleId: string) => {
        if (moduleId === 'react') {
          return require('react');
        } else if (moduleId === 'react-native') {
          return require('react-native');
        }

        return null;
      },
    },
  ): Promise<React.ComponentType<any>> {
    // Warn if verification is turned off
    warning(verify, 'Verification was turned off; this is insecure.');

    // If chunk is already cached, return the cached component
    if (this.cache[chunkId]) {
      return this.cache[chunkId];
    }

    // Resolve the chunk
    const chunk = await this.resolver(chunkId);

    // Verify the chunk if required
    if (verify) {
      const verifiedChunk = await this.nativeChunkManager.verify(
        // @ts-ignore
        chunk.data,
        // @ts-ignore
        chunk.hash,
        publicKey,
      );

      return this.chunkToComponent(chunkId, verifiedChunk, global);
    }

    // If verification is turned off, decode the chunk
    // @ts-ignore
    const unverifiedChunk = await this.nativeChunkManager.decode(chunk.data);

    return this.chunkToComponent(chunkId, unverifiedChunk, global);
  }
}
