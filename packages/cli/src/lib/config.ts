import {
  AuthenticationApi,
  ChunksApi,
  Configuration,
  ProjectsApi,
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
 * Creates a configured instance of any ReChunk API client.
 *
 * @param host - The ReChunk server host URL.
 * @param username - Username for basic authentication.
 * @param password - Password for basic authentication.
 * @returns Configured Configuration instance
 */
function createBaseConfiguration(
  host: string,
  username: string,
  password: string,
): Configuration {
  return new Configuration({
    basePath: host,
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
    },
  });
}

/**
 * Creates and returns a configured instance of the ReChunk Chunks API client.
 *
 * @param host - The ReChunk server host URL.
 * @param username - Username for basic authentication.
 * @param password - Password for basic authentication.
 * @returns A configured instance of `ChunksApi`.
 */
export function configureReChunkChunksApi(
  host: string,
  username: string,
  password: string,
): ChunksApi {
  return new ChunksApi(createBaseConfiguration(host, username, password));
}

/**
 * Creates and returns a configured instance of the ReChunk Projects API client.
 *
 * @param host - The ReChunk server host URL.
 * @param username - Username for basic authentication.
 * @param password - Password for basic authentication.
 * @returns A configured instance of `ProjectsApi`.
 */
export function configureReChunkProjectsApi(
  host: string,
  username: string,
  password: string,
): ProjectsApi {
  return new ProjectsApi(createBaseConfiguration(host, username, password));
}

/**
 * Creates and returns a configured instance of the ReChunk Authentication API client.
 *
 * @param host - The ReChunk server host URL.
 * @param username - Username for basic authentication.
 * @param password - Password for basic authentication.
 * @returns A configured instance of `AuthenticationApi`.
 */
export function configureReChunkAuthenticationApi(
  host: string,
  username: string,
  password: string,
): AuthenticationApi {
  return new AuthenticationApi(
    createBaseConfiguration(host, username, password),
  );
}
