import {
  Configuration as ReChunkApiConfiguration,
  DefaultApi as ReChunkApi,
} from '@crherman7/rechunk-api-client';
import withRechunk from '@crherman7/rechunk-rollup-preset';
import {program} from 'commander';
import path from 'path';
import {rollup} from 'rollup';

import {getRechunkConfig, LOGO} from '../lib';

interface PublishOptions {
  chunk: string;
}

/**
 * Defines a command for the "publish" operation using the "commander" library.
 * Bundles a specified chunk and publishes it to the configured ReChunk server.
 *
 * @example
 * ```bash
 * yarn rechunk publish --chunk foo
 * ```
 */
program
  .command('publish <chunk>')
  .description('Publishes a specified chunk')
  .action(async (chunk: string) => {
    console.log();
    console.log(LOGO);

    try {
      const rc = getValidatedConfig(chunk);
      const code = await bundleChunk(rc.entry[chunk], chunk);
      await publishChunk(rc.host, chunk, code, rc.project, rc.writeKey);

      console.log(`🎉 Successfully published ${chunk}!\n`);
    } catch (error) {
      logError((error as Error).message);
    }
  });

/**
 * Retrieves and validates the ReChunk configuration, ensuring that the specified chunk
 * is present as an entry point in `rechunk.json`.
 *
 * @param chunk - The name of the chunk to be published.
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
 * Bundles the specified chunk using Rollup and returns the generated code.
 *
 * @param inputPath - The file path of the entry point for the chunk.
 * @param chunk - The name of the chunk (used in log messages).
 * @returns A promise that resolves to the bundled code as a string.
 */
async function bundleChunk(inputPath: string, chunk: string): Promise<string> {
  console.log(`🛠  Bundling ${chunk}...\n`);

  const input = path.resolve(process.cwd(), inputPath);
  const rollupBuild = await rollup(await withRechunk({input}));

  const {
    output: [{code}],
  } = await rollupBuild.generate({});
  return code;
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
 * Publishes the bundled code for a specified chunk to the ReChunk server.
 *
 * @param host - The URL of the ReChunk server.
 * @param chunk - The name of the chunk to publish.
 * @param code - The bundled code to publish.
 * @param project - The project ID used for authentication.
 * @param writeKey - The write key used for authentication.
 * @returns A promise that resolves upon successful publication of the chunk.
 * @throws {Error} If the server responds with an error or a non-OK status.
 */
async function publishChunk(
  host: string,
  chunk: string,
  code: string,
  project: string,
  writeKey: string,
): Promise<void> {
  console.log(`🚀 Publishing ${chunk}...\n`);

  const api = configureReChunkApi(host, project, writeKey);
  try {
    await api.createChunkForProject({
      projectId: project,
      chunkId: chunk,
      body: code,
    });
  } catch (error) {
    throw new Error(`Failed to publish chunk: ${(error as Error).message}`);
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
