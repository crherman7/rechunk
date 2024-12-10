import {program} from 'commander';

import {configureReChunkApi, getRechunkConfig, LOGO} from '../lib';

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
      const rc = getRechunkConfig();
      await unpublishChunk(rc.host, chunk, rc.project, rc.writeKey);

      console.log(`🎉 Successfully unpublished ${chunk}!\n`);
    } catch (error) {
      logError((error as Error).message);
    }
  });

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
