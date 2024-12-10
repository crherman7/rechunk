import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import {nonWindowsCall} from './ps';
import {findWorkspaceDir} from './workspace';

/**
 * Identifier for Node.js processes, used to filter processes running on the system.
 */
const NODE_IDENTIFIER = 'node';

/**
 * Relative path to the `node_modules` directory.
 */
const NODE_MODULES_RELATIVE_PATH = './node_modules';

/**
 * Command used to start the Rechunk development server.
 */
const RECHUNK_DEV_SERVER_COMMAND = 'rechunk dev-server';

/**
 * Checks if the Rechunk development server is currently running.
 *
 * @returns `true` if the Rechunk development server is running, otherwise `false`.
 *
 * @remarks
 * This function inspects the system's running processes, looking for processes
 * that match the `rechunk dev-server` command. It checks for matches that either:
 * - Start with `node ./node_modules`
 * - Start with `node <workspaceDir>`
 *
 * @example
 * ```typescript
 * const isRunning = isRechunkDevServerRunning();
 * console.log(isRunning); // true or false
 * ```
 */
export function isRechunkDevServerRunning(): boolean {
  const processes = nonWindowsCall();
  const workspaceDir = findWorkspaceDir(process.cwd());

  return processes.some(
    process =>
      typeof process.cmd === 'string' &&
      process.cmd.includes(RECHUNK_DEV_SERVER_COMMAND) &&
      (process.cmd.startsWith(
        `${NODE_IDENTIFIER} ${NODE_MODULES_RELATIVE_PATH}`,
      ) ||
        process.cmd.startsWith(`${NODE_IDENTIFIER} ${workspaceDir}`)),
  );
}

/**
 * Generates a cache version string for the Metro Bundler.
 *
 * @returns A hashed cache version string based on the `.rechunkrc.json` modification time,
 * the current Rechunk environment, and the status of the Rechunk development server.
 *
 * @remarks
 * This function reads the `.rechunkrc.json` file to determine its last modified time and combines it
 * with the current environment variable `RECHUNK_ENVIRONMENT` and whether the Rechunk dev server
 * is running to generate a unique cache version.
 *
 * @example
 * ```typescript
 * const cacheVersion = getCacheVersion();
 * console.log(cacheVersion); // e.g., "3d94d1c0f..."
 * ```
 */
export function getCacheVersion(): string {
  const rechunkEnvironment = process.env.RECHUNK_ENVIRONMENT || '';

  const rechunkJSONPath = path.resolve(process.cwd(), '.rechunkrc.json');
  const stats = fs.statSync(rechunkJSONPath);

  return crypto
    .createHash('md5')
    .update(String(stats.mtime)) // Use last modified time of `.rechunkrc.json`
    .update(rechunkEnvironment) // Include the environment variable
    .update(isRechunkDevServerRunning().toString()) // Include dev server status
    .digest('hex'); // Return as a hexadecimal string
}
