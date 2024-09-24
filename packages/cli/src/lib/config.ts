import fs from 'fs';
import path from 'path';

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
