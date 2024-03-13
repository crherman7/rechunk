// Importing necessary modules and types
import warning from 'tiny-warning';
import invariant from 'tiny-invariant';
import EventEmitter from 'eventemitter3';
import {NativeModules} from 'react-native';

import base64 from './base64';
import type {ResolverFunction} from '../@types';

/**
 * Manager class for handling chunk imports and caching.
 */
export class ChunkManager extends EventEmitter {
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
  protected constructor(private nativeChunkManager = NativeModules.ReChunk) {
    super();

    // Ensure only one instance of ChunkManager is created
    invariant(
      !ChunkManager.instance,
      'ChunkManager was already instantiated. Use ChunkManager.shared instead.',
    );

    // // Throw error if nativeChunkManager is not found
    // invariant(
    //   nativeChunkManager,
    //   'rechunk react-native module was not found.' +
    //     (__DEV__ ? ' Did you forget to update native dependencies?' : ''),
    // );
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
    const module = {exports};

    const args = () => {
      /**
       * Typical transiplers/bundlers will export modules.exports
       */
      if (chunk.includes('module.exports')) {
        return {
          initialArgs: 'module, exports',
          additionalArgs: [global, module, exports],
          returnStatement: 'return module.exports;',
        };
      }

      /**
       * Babel v6+ go remove module.exports in favor of just exports
       */
      return {
        initialArgs: 'exports',
        additionalArgs: [global, exports],
        returnStatement: 'return exports.default;',
      };
    };

    const {initialArgs, additionalArgs, returnStatement} = args();

    const Component = new Function(
      '__rechunk__',
      initialArgs,
      `${Object.keys(global)
        .map(key => `var ${key} = __rechunk__.${key};`)
        .join('\n')} ${chunk} ${returnStatement}`,
    )(...additionalArgs);

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
  ): Promise<{default: React.ComponentType<any>}> {
    // Warn if verification is turned off
    warning(verify, 'Verification was turned off; this is insecure.');

    // If chunk is already cached, return the cached component
    if (this.cache[chunkId]) {
      return {default: this.cache[chunkId]};
    }

    // Resolve the chunk
    const chunk = await this.resolver(chunkId);

    // Verify the chunk if required
    // if (verify) {
    //   const verifiedChunk = await this.nativeChunkManager.verify(
    //     // @ts-ignore
    //     chunk.data,
    //     // @ts-ignore
    //     chunk.hash,
    //     //@ts-ignore
    //     chunk.sig,
    //     publicKey,
    //   );

    //   return {default: this.chunkToComponent(chunkId, verifiedChunk, global)};
    // }

    // If verification is turned off, decode the chunk
    const unverifiedChunk = base64.decode(chunk);

    return {default: this.chunkToComponent(chunkId, unverifiedChunk, global)};
  }
}
