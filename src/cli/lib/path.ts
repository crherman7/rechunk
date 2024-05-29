import fs from 'fs';
import path from 'path';

/**
 * Retrieves the ios path from the project root.
 *
 * This function checks for the presence of `ios` directory in the
 * root directory of the project. If the file exists, it reads and returns
 * the path to `ios` directory.
 *
 * @param {string} [dir=process.cwd()] - The directory to start searching for the ios directory. Defaults to the current working directory.
 * @returns {string} - The path to the iso directory.
 * @throws Will throw an error if the `ios` directory is not found.
 */
export function getIOSPath(dir: string = process.cwd()): string {
  const iosPath = path.resolve(dir, 'ios');

  if (!fs.existsSync(iosPath)) {
    throw new Error('[ReChunk]: cannot find path for ios directory.');
  }

  return iosPath;
}

/**
 * Retrieves the android path from the project root.
 *
 * This function checks for the presence of `android` directory in the
 * root directory of the project. If the file exists, it reads and returns
 * the path to `android` directory.
 *
 * @param {string} [dir=process.cwd()] - The directory to start searching for the android directory. Defaults to the current working directory.
 * @returns {string} - The path to the android directory.
 * @throws Will throw an error if the `android` directory is not found.
 */
export function getAndroidPath(dir: string = process.cwd()): string {
  const androidPath = path.resolve(dir, 'android');

  if (!fs.existsSync(androidPath)) {
    throw new Error('[ReChunk]: cannot find path for android directory.');
  }

  return androidPath;
}
