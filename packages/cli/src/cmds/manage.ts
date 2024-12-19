import {program} from 'commander';
import open from 'open';

import {
  configureReChunkApi,
  getRechunkConfig,
  LOGO,
  constructAuthTokenURL,
} from '../lib';
import {Token} from '@crherman7/rechunk-api-client';

/**
 * Registers the `manage` command to the CLI.
 *
 * This command generates a short-lived token for the ReChunk project
 * and opens the browser to the chunks management page with the token pre-authenticated.
 *
 * @example
 * ```bash
 * pnpm rechunk manage
 * ```
 */
program
  .command('manage')
  .description(
    'Opens the browser to the chunks management page with a verified token',
  )
  .action(async () => {
    console.log();
    console.log(LOGO);

    const ora = await import('ora');
    const spinner = ora.default('Generating auth token...').start();

    const {host, project, writeKey} = getRechunkConfig();
    const {token} = await manageCunks(host, project, writeKey);
    spinner.succeed('Generated auth token.');

    spinner.start(`Opening browser at ${host}/auth/token...`);
    await open(constructAuthTokenURL(host, project, (token as any).token));
    spinner.succeed(`Opened browser at ${host}/auth/token.`);
  });

/**
 * Manages chunks for a specified ReChunk project by creating an API token.
 *
 * This function configures the ReChunk API using the provided `host`, `project`, and `writeKey`,
 * and attempts to create a token for managing chunks. If an error occurs, it throws a detailed error message.
 *
 * @param {string} host - The base URL of the ReChunk host.
 * @param {string} project - The name or identifier of the ReChunk project.
 * @param {string} writeKey - The write key for authenticating with the ReChunk API.
 * @returns {Promise<string>} A promise that resolves to the generated API token for managing chunks.
 * @throws {Error} Throws an error if the token creation fails, including the specific error message.
 *
 * @example
 * ```typescript
 * const token = await manageChunks('https://api.rechunk.io', 'my-project', 'my-write-key');
 * console.log('Token:', token);
 * ```
 */
async function manageCunks(
  host: string,
  project: string,
  writeKey: string,
): Promise<Token> {
  const api = configureReChunkApi(host, project, writeKey);
  try {
    return api.createToken();
  } catch (error) {
    throw new Error(`Failed to publish chunk: ${(error as Error).message}`);
  }
}
