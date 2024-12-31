import {
  Configuration as ReChunkApiConfiguration,
  DefaultApi as ReChunkApi,
} from '@rechunk/api-client';
import fs from 'fs';
import path from 'path';

/**
 * Retrieves the ReChunk configuration from the project root.
 *
 * This function checks for the presence of a `.rechunkrc.json` file in the
 * root directory of the project. If the file exists, it reads and returns
 * the parsed configuration object.
 *
 * @param {string} [dir=process.cwd()] - The directory to start searching for the ReChunk configuration. Defaults to the current working directory.
 * @returns {ReChunkConfig} The ReChunk configuration object.
 * @throws Will throw an error if the `.rechunkrc.json` file is not found.
 */
export function getRechunkConfig(dir: string = process.cwd()): ReChunkConfig {
  const rechunkConfigPath = path.resolve(dir, '.rechunkrc.json');

  if (!fs.existsSync(rechunkConfigPath)) {
    throw new Error(
      '[ReChunk]: cannot find rechunk configuration, ensure there is a .rechunkrc.json in the root of your project. If there is not, please generate a ReChunk project with the init command.',
    );
  }

  const rechunkConfig = require(rechunkConfigPath);

  return rechunkConfig;
}

/**
 * Creates and returns a configured instance of the ReChunk API client.
 *
 * @param host - The ReChunk server host URL.
 * @param username - Username for basic authentication.
 * @param password - Password for basic authentication.
 * @returns A configured instance of `ReChunkApi`.
 */
export function configureReChunkApi(
  host: string,
  username: string,
  password: string,
): ReChunkApi {
  return new ReChunkApi(
    new ReChunkApiConfiguration({
      basePath: host,
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
    }),
  );
}
