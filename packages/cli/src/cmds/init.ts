import {Project} from '@rechunk/api-client';
import chalk from 'chalk';
import {program} from 'commander';
import fs from 'fs';
import path from 'path';

import {configureReChunkProjectsApi, LOGO} from '../lib';

/**
 * Options for the `init` command.
 */
interface InitOptions {
  /** The ReChunk server host URL. */
  host: string;
  /** The username for basic authentication. */
  username: string;
  /** The password for basic authentication. */
  password: string;
}

/**
 * Initializes a ReChunk project by creating a configuration file (`.rechunkrc.json`).
 *
 * @example
 * ```bash
 * pnpm rechunk init -h https://rechunk.example.com -u myUser -p myPassword
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

    const ora = await import('ora');
    const spinner = ora.default();

    const {host, username, password} = options;
    const ctx = process.cwd();
    const rcPath = path.resolve(ctx, '.rechunkrc.json');

    try {
      spinner.start('Validating host URL...');
      validateHost(host);
      spinner.succeed('Host URL is valid.');

      spinner.start('Checking for existing project...');
      checkProjectExists(rcPath);
      spinner.succeed('No existing project found.');

      spinner.start('Creating project on the ReChunk server...');
      const {createdAt, updatedAt, id, ...projectData} = await createProject(
        host,
        username,
        password,
      );
      spinner.succeed('Project created successfully.');

      spinner.start('Saving project configuration...');
      saveProjectFile(rcPath, {
        ...projectData,
        $schema: 'https://crherman7.github.io/rechunk/schema.json',
        project: id,
        host,
        external: [],
      } as any);
      spinner.succeed('Project configuration saved.');

      console.log(
        chalk.green(
          '\n🎉 Successfully initialized a new ReChunk project! Generated .rechunkrc.json.',
        ),
      );
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${(error as Error).message}`));
    }
  });

/**
 * Validates if the host URL matches the required format.
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
 * Creates a new project on the ReChunk server.
 *
 * @param host - The ReChunk server host URL.
 * @param username - The username for basic authentication.
 * @param password - The password for basic authentication.
 * @returns A promise that resolves to the project data.
 * @throws {Error} If the request to initialize the project fails.
 */
async function createProject(
  host: string,
  username: string,
  password: string,
): Promise<Project> {
  const api = configureReChunkProjectsApi(host, username, password);
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
  fs.writeFileSync(
    rcPath,
    JSON.stringify(
      Object.keys(data)
        .sort()
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {}),
      null,
      2,
    ) + '\n',
  );
}
