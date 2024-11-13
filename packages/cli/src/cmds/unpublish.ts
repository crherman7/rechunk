import {
  Configuration as ReChunkApiConfiguration,
  DefaultApi as ReChunkApi,
} from '@crherman7/rechunk-api-client';
import {program} from 'commander';

import {getRechunkConfig, LOGO} from '../lib';

/**
 * Defines a command for the "unpublish" operation using the "commander" library.
 * Unpublishes a specified chunk by sending a delete request to the server.
 *
 * @example
 * ```bash
 * yarn rechunk unpublish foo
 * ```
 */
program
  .command('unpublish <chunk>')
  .description('Unpublishes a specified chunk')
  .action(async (chunk: string) => {
    console.log(LOGO);

    try {
      const rc = getValidatedConfig(chunk);
      await unpublishChunk(rc.host, chunk, rc.project, rc.writeKey);

      console.log(`🎉 Successfully unpublished ${chunk}!\n`);
    } catch (error) {
      logError((error as Error).message);
    }
  });

/**
 * Retrieves and validates the ReChunk configuration, ensuring that the specified chunk
 * is present as an entry point in `rechunk.json`.
 *
 * @param chunk - The name of the chunk to unpublish.
 * @returns The validated ReChunk configuration object.
 * @throws {Error} If the specified chunk does not exist as an entry point in the configuration.
 */
function getValidatedConfig(
  chunk: string,
): ReturnType<typeof getRechunkConfig> {
  const rc = getRechunkConfig();

  if (!rc.entry[chunk]) {
    throw new Error(
      `Chunk "${chunk}" does not exist as an entry point in rechunk.json`,
    );
  }

  return rc;
}

/**
 * Configures and returns an instance of the ReChunk API client.
 *
 * @param host - The base URL of the ReChunk server.
 * @param username - Username for basic authentication.
 * @param password - Password for basic authentication.
 * @returns A configured instance of `ReChunkApi`.
 */
function configureReChunkApi(
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

/**
 * Unpublishes the specified chunk from the ReChunk server by sending a DELETE request.
 *
 * @param host - The URL of the ReChunk server.
 * @param chunk - The name of the chunk to unpublish.
 * @param project - The project ID used for authentication.
 * @param writeKey - The write key used for authentication.
 * @returns A promise that resolves upon successful unpublishing of the chunk.
 * @throws {Error} If the server responds with an error or a non-OK status.
 */
async function unpublishChunk(
  host: string,
  chunk: string,
  project: string,
  writeKey: string,
): Promise<void> {
  console.log(`🗑️ Unpublishing ${chunk}...\n`);

  const api = configureReChunkApi(host, project, writeKey);
  try {
    await api.deleteChunkById({chunkId: chunk, projectId: project});
  } catch (error) {
    throw new Error(`Failed to unpublish chunk: ${(error as Error).message}`);
  }
}

/**
 * Logs an error message in a consistent format, enhancing readability for the user.
 *
 * @param message - The error message to display.
 */
function logError(message: string): void {
  console.log(`❌ Error: ${message}\n`);
}
