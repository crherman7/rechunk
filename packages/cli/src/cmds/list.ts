import {
  Configuration as ReChunkApiConfiguration,
  DefaultApi as ReChunkApi,
} from '@crherman7/rechunk-api-client';
import Table from 'cli-table3';
import {program} from 'commander';

import {getRechunkConfig, LOGO} from '../lib';

/**
 * Defines a command for the "list" operation using the "commander" library.
 * Lists all published chunks by fetching data from the ReChunk server.
 *
 * @example
 * ```bash
 * yarn rechunk list
 * ```
 */
program
  .command('list')
  .description('List all published chunks')
  .action(async () => {
    console.log(LOGO);

    try {
      const rc = getRechunkConfig();
      const chunks = await fetchPublishedChunks(
        rc.host,
        rc.project,
        rc.readKey,
      );
      displayChunksTable(chunks, rc.project);
    } catch (error) {
      logError((error as Error).message);
    }
  });

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
 * Fetches published chunks from the ReChunk server for the specified project.
 *
 * @param host - The URL of the ReChunk server.
 * @param project - The project ID for authentication.
 * @param readKey - The read key for authentication.
 * @returns A promise resolving to an array of chunk data objects.
 * @throws {Error} If the server responds with an error or a non-OK status.
 */
async function fetchPublishedChunks(
  host: string,
  project: string,
  readKey: string,
): Promise<Array<{id: string; name: string; timestamp: string}>> {
  const api = configureReChunkApi(host, project, readKey);
  try {
    const chunks = await api.getChunksByProjectId({
      projectId: project,
    });

    // TODO: Fix retrieving chunks
    return [];
  } catch (error) {
    throw new Error(`Failed to get chunks: ${(error as Error).message}`);
  }
}

/**
 * Displays a table of chunks using `cli-table3`.
 *
 * @param chunks - The list of chunks to display.
 * @param projectName - The name of the project to display in the table.
 */
function displayChunksTable(
  chunks: Array<{id: string; name: string; timestamp: string}>,
  projectName: string,
): void {
  const table = new Table({
    head: ['Chunk ID', 'Chunk Name', 'Project', 'Created'],
    style: {
      head: [],
      border: [],
    },
  });

  chunks.forEach(chunk => {
    table.push([chunk.id, chunk.name, projectName, chunk.timestamp]);
  });

  console.log(table.toString());
}

/**
 * Logs an error message in a consistent format, enhancing readability for the user.
 *
 * @param message - The error message to display.
 */
function logError(message: string): void {
  console.log(`❌ Error: ${message}\n`);
}
