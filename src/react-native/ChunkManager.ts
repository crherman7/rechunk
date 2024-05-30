import {NativeModules} from 'react-native';
import {TinyEmitter} from 'tiny-emitter';
import invariant from 'tiny-invariant';
import warning from 'tiny-warning';

import type {CustomRequire, ResolverFunction} from './types';

/**
 * Manager class for handling chunk imports and caching.
 */
export class ChunkManager extends TinyEmitter {
  /**
   * Represents a static instance of the ChunkManager class.
   * This static instance allows access to the ChunkManager functionality without the need to create new instances.
   * @type {ChunkManager}
   * @protected
   */
  protected static instance: ChunkManager;

  /**
   * Cache to store imported chunks.
   * This cache improves performance by storing previously imported chunks for future use.
   * @type {Record<string, React.ComponentType<any>>}
   * @protected
   */
  protected cache: Record<string, React.ComponentType<any>> = {};

  /**
   * Resolver function used to resolve chunk imports.
   * This function is responsible for dynamically loading and resolving imported chunks.
   * @type {ResolverFunction}
   * @protected
   */
  protected resolver: ResolverFunction = async function () {
    // Default resolver function throws error
    throw new Error(
      '[ReChunk]: resolver was not added.' +
        (__DEV__ ? ' Did you forget to addConfiguration?' : ''),
    );
  };

  /**
   * Object representing protected global variables and functions.
   * This object provides controlled access to certain modules and settings.
   * @type {Object}
   * @protected
   */
  protected global: CustomRequire | object = {};

  /**
   * Flag indicating whether verification is enabled.
   * @type {boolean}
   * @protected
   */
  protected verify: boolean = true;

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
  protected constructor(private nativeChunkManager = NativeModules.ReChunk) {
    super();

    // Ensure only one instance of ChunkManager is created
    invariant(
      !ChunkManager.instance,
      '[ReChunk]: ChunkManager was already instantiated. Use ChunkManager.shared instead.',
    );

    // Throw error if nativeChunkManager is not found
    invariant(
      this.nativeChunkManager,
      '[ReChunk]: rechunk react-native module was not found.' +
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
  ): React.ComponentType<any> {
    const exports = {};
    const module = {exports};

    // The new Function operator is allowed to be used here as it is
    // essential to rendering a component from a string.
    // eslint-disable-next-line no-new-func
    const Component = new Function(
      '__rechunk__',
      'module, exports',
      `${Object.keys(this.global)
        .map(key => `var ${key} = __rechunk__.${key};`)
        .join('\n')} ${chunk} ${
        /module\.exports/.test(chunk)
          ? 'return module.exports;'
          : 'return exports.default;'
      }`,
    )(this.global, module, exports);

    // Add chunkId and chunk to cache
    this.cache[chunkId] = Component;

    // Notifies listeners that a chunk is available, facilitating communication
    // for handling edge cases or asynchronous dependencies.
    this.emit(chunkId);

    return Component;
  }

  /**
   * Adds configuration settings to the ChunkManager instance.
   * This method sets the public key, resolver function, verification flag, and global object for the ChunkManager instance.
   * @param {ResolverFunction} resolver - The resolver function used to resolve chunk imports.
   * @param {boolean} verify - Flag indicating whether verification is enabled.
   * @param {object} global - Object representing protected global variables and functions.
   */
  addConfiguration(
    resolver: ResolverFunction,
    verify: boolean,
    global: object,
  ) {
    // Set the resolver function
    this.resolver = resolver;

    // Issue a warning if verification is turned off
    warning(verify, '[ReChunk]: verification is off; chunks are insecure.');

    // Set the verification flag
    this.verify = verify;

    // Set the global require object
    this.global = global;
  }

  /**
   * Imports a chunk asynchronously and returns the corresponding JavaScript component.
   * @param {string} chunkId - The ID of the chunk to import.
   * @returns {Promise<*>} A promise resolving to the JavaScript component imported from the chunk.
   */
  async importChunk(
    chunkId: string,
  ): Promise<{default: React.ComponentType<any>}> {
    // If chunk is already cached, return the cached component
    if (this.cache[chunkId]) {
      return {default: this.cache[chunkId]};
    }

    // Resolve the chunk
    const chunk = await this.resolver(chunkId);

    if (this.verify) {
      await this.nativeChunkManager.verify(chunk.data, chunk.hash, chunk.sig);

      return {default: this.chunkToComponent(chunkId, atob(chunk.data))};
    }

    return {
      default: this.chunkToComponent(chunkId, atob(chunk.data)),
    };
  }
}
