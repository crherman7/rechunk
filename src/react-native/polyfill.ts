/**
 * Polyfill for global `btoa` and `atob` methods if they are not available.
 * @module polyfillBase64
 * @requires base-64
 */

import {decode, encode} from 'base-64';

/**
 * Polyfills the global `btoa` method if it does not exist.
 * `btoa` method encodes a string in base-64 format.
 * @global
 * @function
 * @name global.btoa
 * @param {string} str - The string to encode.
 * @returns {string} - The base-64 encoded string.
 */
if (!global.btoa) {
  global.btoa = encode;
}

/**
 * Polyfills the global `atob` method if it does not exist.
 * `atob` method decodes a base-64 encoded string.
 * @global
 * @function
 * @name global.atob
 * @param {string} str - The base-64 encoded string to decode.
 * @returns {string} - The decoded string.
 */
if (!global.atob) {
  global.atob = decode;
}
