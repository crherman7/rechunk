/**
 * Defines configuration for Rechunk.
 * This configuration specifies entry points for Rechunk to process.
 * @returns {Object} - Rechunk configuration object.
 */
export default {
  /**
   * Specifies entry points for Rechunk to process.
   * Each entry point is associated with a corresponding source file.
   * @type {Object}
   */
  entry: {
    foo: './src/Foo.tsx',
  },

  /**
   * Specifies the path to the private key for authentication or authorization.
   * @type {string}
   */
  privateKeyPath: './keys/private.pem',
};
