import {Project} from '@crherman7/rechunk-api-client';
import {program} from 'commander';
import fs from 'fs';
import path from 'path';

import {configureReChunkApi, LOGO} from '../lib';

interface InitOptions {
  host: string;
  username: string;
  password: string;
}

/**
 * Defines a command for the "init" operation using the "commander" library.
 * Initializes a new ReChunk project by creating a configuration file (`.rechunkrc.json`)
 * with the server details provided through command-line options.
 *
 * @example
 * ```bash
 * yarn rechunk init -h https://rechunk.example.com -u myUser -p myPassword
 * ```
 */
program
  .command('init')
  .description('Initializes a ReChunk project')
  .requiredOption('-h, --host <host>', 'ReChunk server host URL')
  .requiredOption('-u, --username <username>', 'Username for basic auth')
  .requiredOption('-p, --password <password>', 'Password for basic auth')
  .action(async (options: InitOptions) => {
    console.log(LOGO);

    const {host, username, password} = options;
    const ctx = process.cwd();
    const rcPath = path.resolve(ctx, '.rechunkrc.json');

    try {
      validateHost(host);
      checkProjectExists(rcPath);

      console.log('🚀 Creating project...\n');

      const projectData = await createProject(host, username, password);
      saveProjectFile(rcPath, {
        ...projectData,
        host,
        external: [],
      } as any);

      console.log(
        '🎉 Successfully initialized a new ReChunk project. Generated .rechunkrc.json!\n',
      );
    } catch (error) {
      logError((error as Error).message);
    }
  });

/**
 * Validates if the host URL matches the required format.
 * Throws an error if the URL format is invalid.
 *
 * @param host - The host URL to validate.
 * @throws {Error} If the URL format does not match the expected schema.
 */
function validateHost(host: string): void {
  const urlPattern = /^http(|s):\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/;
  if (!host.match(urlPattern)) {
    throw new Error(
      'The provided host URL does not match the expected format (e.g., https://rechunk.onrender.com, https://localhost:3000).',
    );
  }
}

/**
 * Checks if the project already exists by verifying the presence of `.rechunkrc.json`.
 * Throws an error if `.rechunkrc.json` is found in the current directory.
 *
 * @param rcPath - The file path to the `.rechunkrc.json` file.
 * @throws {Error} If `.rechunkrc.json` already exists in the directory.
 */
function checkProjectExists(rcPath: string): void {
  if (fs.existsSync(rcPath)) {
    throw new Error(
      'Project already exists. Please remove .rechunkrc.json before initializing a new project.',
    );
  }
}

/**
 * Fetches project data from the ReChunk server using the ReChunk API client.
 *
 * @param host - The ReChunk server host URL.
 * @param username - Username for basic authentication.
 * @param password - Password for basic authentication.
 * @returns A promise resolving to the project data as a `Project` object.
 * @throws {Error} If the request to initialize the project fails.
 */
async function createProject(
  host: string,
  username: string,
  password: string,
): Promise<Project> {
  const api = configureReChunkApi(host, username, password);
  try {
    return await api.createProject();
  } catch (error) {
    throw new Error(
      `Failed to initialize project: ${(error as Error).message}`,
    );
  }
}

/**
 * Saves the provided project data to `.rechunkrc.json` in the current directory.
 *
 * @param rcPath - The file path to save the `.rechunkrc.json` file.
 * @param data - The project data to be saved.
 */
function saveProjectFile(rcPath: string, data: Project): void {
  fs.writeFileSync(rcPath, JSON.stringify(data, null, 2) + '\n');
  console.log('✅ Project data saved successfully to .rechunkrc.json');
}

/**
 * Logs errors in a consistent format, making user feedback more clear and readable.
 *
 * @param message - The error message to display.
 */
function logError(message: string): void {
  console.log(`❌ Error: ${message}\n`);
}
