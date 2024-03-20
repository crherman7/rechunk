/**
 * This polyfill file adds support for the global `btoa` and `atob` methods
 * if they are not already defined in the environment.
 */
import './polyfill';

import {TinyEmitter} from 'tiny-emitter';

// Importing ChunkManager class from './ChunkManager' file
import {ChunkManager} from './ChunkManager';
// Importing ResolverFunction type from '../@types' file
import type {CustomRequire, ResolverFunction} from './types';

/**
 * Asynchronously imports a chunk using the shared ChunkManager instance.
 * @param {string} chunkId - The ID of the chunk to import.
 * @returns {Promise<*>} A promise resolving to the imported JavaScript component.
 */
export async function importChunk(chunkId: string): Promise<any> {
  // Using shared ChunkManager instance to import the chunk
  return ChunkManager.shared.importChunk(chunkId);
}

/**
 * Adds configuration settings to the ChunkManager.
 * This function is used to configure the ChunkManager with specified settings such as public key, resolver function, verification flag, and global object.
 * @param {ResolverFunction} resolver - The resolver function used to resolve chunk imports.
 * @param {boolean} verify - Flag indicating whether verification is enabled.
 * @param {object} global - Object representing protected global variables and functions.
 */
function addConfiguration(
  resolver: ResolverFunction,
  verify: boolean,
  global: CustomRequire = {
    /**
     * Custom implementation of require function to control module access.
     * @param {string} moduleId - The ID of the module to be required.
     * @returns {Object|null} - The required module if allowed, otherwise null.
     * @protected
     */
    require: (moduleId: string): object | null => {
      if (moduleId === 'react') {
        return require('react');
      } else if (moduleId === 'react-native') {
        return require('react-native');
      }

      return null;
    },
  },
) {
  // Delegates the configuration addition to the shared instance of ChunkManager
  ChunkManager.shared.addConfiguration(resolver, verify, global);
}

/**
 * Registers an event listener with the specified event name and callback function.
 * Optionally, you can provide a context object (`ctx`) to bind `this` when the callback is invoked.
 * @param {string} event - The name of the event to listen for.
 * @param {Function} callback - The function to be invoked when the event is emitted.
 * @param {any} [ctx] - (Optional) The context to bind to the callback function.
 * @returns {TinyEmitter} - The `TinyEmitter` instance for chaining purposes.
 */
export function on(event: string, callback: Function, ctx?: any): TinyEmitter {
  // Calls the `on` method of the shared `ChunkManager` instance to register the event listener.
  // Passes the provided event name, callback function, and optional context to the `on` method.
  return ChunkManager.shared.on(event, callback, ctx);
}

/**
 * Type-guards the configuration for Re.Chunk.
 * @param {ChunkConfig} config - The config to guard.
 * @returns {ChunkConfig} A type-guarded Re.Chunk configuration.
 */
// export {defineConfig} from './config';

/**
 * Exports the addResolver function under the default namespace,
 * making it accessible under the ReChunk namespace.
 */
export default {
  addConfiguration,
};

/**
 * This statement exports all named exports from the './types' module.
 * It effectively re-exports all exports from './types', allowing them to be imported from this module.
 */
export * from './types';
