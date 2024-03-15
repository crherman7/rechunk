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
        (__DEV__ ? ' Did you forget to addResolver?' : ''),
    );
  };

  /**
   * Object representing protected global variables and functions.
   * This object provides controlled access to certain modules and settings.
   * @type {Object}
   * @protected
   */
  protected global: Object = {
    /**
     * Custom implementation of require function to control module access.
     * @param {string} moduleId - The ID of the module to be required.
     * @returns {Object|null} - The required module if allowed, otherwise null.
     * @protected
     */
    require: (moduleId: string) => {
      if (moduleId === 'react') {
        return require('react');
      } else if (moduleId === 'react-native') {
        return require('react-native');
      }

      return null;
    },
  };

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

    const args = () => {
      /**
       * Typical transiplers/bundlers will export modules.exports
       */
      if (/module\.exports/.test(chunk)) {
        return {
          initialArgs: 'module, exports',
          additionalArgs: [this.global, module, exports],
          returnStatement: 'return module.exports;',
        };
      }

      /**
       * Babel v6+ go remove module.exports in favor of just exports
       */
      return {
        initialArgs: 'exports',
        additionalArgs: [this.global, exports],
        returnStatement: 'return exports.default;',
      };
    };

    const {initialArgs, additionalArgs, returnStatement} = args();

    const Component = new Function(
      '__rechunk__',
      initialArgs,
      `${Object.keys(this.global)
        .map(key => `var ${key} = __rechunk__.${key};`)
        .join('\n')} ${chunk} ${returnStatement}`,
    )(...additionalArgs);

    this.cache[chunkId] = Component;

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
   * @param {boolean} verify - Indicates whether to verify the chunk.
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

    // Verify the chunk if required
    // if (verify) {
    //   const verifiedChunk = await this.nativeChunkManager.verify(
    //     // @ts-ignore
    //     chunk.data,
    //     // @ts-ignore
    //     chunk.hash,
    //     //@ts-ignore
    //     chunk.sig,
    //   );

    //   return {default: this.chunkToComponent(chunkId, verifiedChunk, global)};
    // }

    return {
      default: this.chunkToComponent(chunkId, base64.decode(chunk)),
    };
  }
}
