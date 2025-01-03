import {isRechunkDevServerRunning} from '@rechunk/utils';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Generates a cache version string for the Metro Bundler.
 *
 * The cache version is created by combining and hashing:
 * - The last modified time of the .rechunkrc.json config file
 * - The current RECHUNK_ENVIRONMENT value
 * - Whether the Rechunk dev server is running
 *
 * @returns An MD5 hash string that can be used as a cache key
 * @throws {Error} If .rechunkrc.json cannot be accessed
 */
export const cacheVersion = (() => {
  const rechunkEnvironment = process.env.RECHUNK_ENVIRONMENT || '';

  const rechunkJSONPath = path.resolve(process.cwd(), '.rechunkrc.json');
  const stats = fs.statSync(rechunkJSONPath);

  return crypto
    .createHash('md5')
    .update(String(stats.mtime))
    .update(rechunkEnvironment)
    .update(isRechunkDevServerRunning().toString())
    .digest('hex');
})();
