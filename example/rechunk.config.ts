import {defineConfig} from '@crherman7/rechunk';

/**
 * Defines configuration for Rechunk.
 * This configuration specifies entry points for Rechunk to process.
 * @returns {Object} - Rechunk configuration object.
 */
export default defineConfig({
  /**
   * Specifies entry points for Rechunk to process.
   * Each entry point is associated with a corresponding source file.
   * @type {Object}
   */
  entry: {
    foo: './src/Foo.tsx',
  },
});
