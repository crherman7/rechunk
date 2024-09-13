import fs from 'fs';
import path from 'path';
import type {PackageJson} from 'type-fest';

/**
 * Retrieves the ReChunk configuration from the project root.
 *
 * This function checks for the presence of a `rechunk.json` file in the
 * root directory of the project. If the file exists, it reads and returns
 * the parsed configuration object.
 *
 * @param {string} [dir=process.cwd()] - The directory to start searching for the ReChunk configuration. Defaults to the current working directory.
 * @returns {ReChunkConfig} The ReChunk configuration object.
 * @throws Will throw an error if the `rechunk.json` file is not found.
 */
export function getRechunkConfig(dir: string = process.cwd()): ReChunkConfig {
  const rechunkConfigPath = path.resolve(dir, 'rechunk.json');

  if (!fs.existsSync(rechunkConfigPath)) {
    throw new Error(
      '[ReChunk]: cannot find rechunk configuration, ensure there is a rechunk.json in the root of your project. If there is not, please generate a ReChunk project with the init command.',
    );
  }

  const rechunkConfig = require(rechunkConfigPath);

  return rechunkConfig;
}

/**
 * Retrieves the package.json configuration from the project root.
 *
 * This function checks for the presence of a `package.json` file in the
 * root directory of the project. If the file exists, it reads and returns
 * the parsed configuration object.
 *
 * @param {string} [dir=process.cwd()] - The directory to start searching for the package.json. Defaults to the current working directory.
 * @returns {PackageJson} The package.json configuration object.
 * @throws Will throw an error if the `package.json` file is not found.
 */
export function getPackageJson(dir: string = process.cwd()): PackageJson {
  const packageJsonPath = path.resolve(dir, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('[ReChunk]: cannot find package.json.');
  }

  const pak = require(packageJsonPath);

  return pak;
}
