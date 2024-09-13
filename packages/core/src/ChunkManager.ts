import {
  Chunk,
  Configuration as ReChunkApiConfiguration,
  DefaultApi as ReChunkApi,
} from '@crherman7/rechunk-api-client';
import React from 'react';
import {TinyEmitter} from 'tiny-emitter';
import invariant from 'tiny-invariant';
import warning from 'tiny-warning';

import {createIntegrityChecker} from './jws';
import type {
  Configuration,
  CustomRequire,
  DeepRequired,
  ResolverFunction,
} from './types';

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
   * An instance of the ReChunkApi class that is used to make requests to the API.
   *
   * @type {ReChunkApi}
   * @protected
   */
  protected request: ReChunkApi = new ReChunkApi(
    new ReChunkApiConfiguration({basePath: process.env.__RECHUNK_HOST__}),
  );

  /**
   * Resolver function used to resolve chunk imports.
   * This function is responsible for dynamically loading and resolving imported chunks.
   * @type {ResolverFunction}
   * @protected
   */
  protected resolver: ResolverFunction = async chunkId => {
    try {
      if (!chunkId || typeof chunkId !== 'string') {
        throw new Error('[ReChunk]: Invalid chunkId provided');
      }

      const response = await this.request.getChunkById(
        {
          projectId: process.env.__RECHUNK_PROJECT__ as string,
          chunkId,
        },
        {
          headers: {
            Authorization: `Basic ${btoa(
              `${process.env.__RECHUNK_PROJECT__}:${process.env.__RECHUNK_READ_KEY__}`,
            )}`,
          },
        },
      );

      if (!response.data || !response.token) {
        throw new Error(`[ReChunk]: Failed to fetch chunk with ID ${chunkId}`);
      }

      return response as DeepRequired<Chunk>;
    } catch (error: any) {
      throw new Error(`[ReChunk]: Failed to fetch chunk: ${error.message}`);
    }
  };

  /**
   * Object representing protected global variables and functions.
   * This object provides controlled access to certain modules and settings.
   * @type {Object}
   * @protected
   */
  protected global: CustomRequire = process.env
    .__RECHUNK_GLOBAL__ as unknown as CustomRequire;

  /**
   * Flag indicating whether verification is enabled.
   * @type {boolean}
   * @protected
   */
  protected verify: boolean = true;

  /**
   * The public key used to verify function.
   * @type {string}
   * @protected
   */
  protected publicKey: string = process.env.__RECHUNK_PUBLIC_KEY__ as string;

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
  protected constructor() {
    super();

    // Ensure only one instance of ChunkManager is created
    invariant(
      !ChunkManager.instance,
      '[ReChunk]: ChunkManager was already instantiated. Use ChunkManager.shared instead.',
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
   * @param {Configuration} config - The configuration object for ChunkManager.
   * @param {boolean} [config.verify] - Flag indicating whether verification is enabled.
   * @param {CustomRequire} [config.global] - Object representing protected global variables and functions.
   * @param {ResolverFunction} [config.resolver] - The resolver function used to resolve chunk imports.
   * @param {ResolverFunction} [config.publicKey] - The publicKey for ChunkManager configuration.
   */
  addConfiguration({resolver, verify, global, publicKey}: Configuration) {
    if (resolver) {
      // Set the resolver function
      this.resolver = resolver;
    }

    if (verify !== undefined) {
      // Issue a warning if verification is turned off
      warning(verify, '[ReChunk]: verification is off; chunks are insecure.');

      // Set the verification flag
      this.verify = verify;
    }

    if (global) {
      // Set the global require object
      this.global = global;
    }

    if (publicKey) {
      // Set the publicKey
      this.publicKey = publicKey;
    }
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

    const integrityChecker = createIntegrityChecker(
      'sha256',
      'RS256',
      this.publicKey,
    );

    if (this.verify) {
      const verified = integrityChecker.verify(chunk.data, chunk.token);

      if (!verified) {
        throw new Error('cannot verify hash');
      }

      return {default: this.chunkToComponent(chunkId, chunk.data)};
    }

    return {
      default: this.chunkToComponent(chunkId, chunk.data),
    };
  }
}
