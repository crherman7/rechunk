import withRechunk from '@crherman7/rechunk-rollup-preset';
import chalk from 'chalk';
import {program} from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import {rollup} from 'rollup';

import {
  aggregateUseRechunkFiles,
  configureReChunkApi,
  getRechunkConfig,
  LOGO,
} from '../lib';

/**
 * Registers the `publish-all` command to the CLI.
 *
 * This command aggregates all `.tsx` files containing the `"use rechunk"` directive,
 * prompts the user to select which components to publish, bundles the selected components
 * using Rollup, and publishes them to the ReChunk server.
 *
 * @example
 * ```bash
 * yarn rechunk publish-all
 * ```
 */
program
  .command('publish')
  .description('Aggregates and publishes selected ReChunk components')
  .action(async () => {
    console.log();
    console.log(LOGO);

    const ora = await import('ora');

    const spinner = ora.default('Aggregating ReChunk files...').start();

    try {
      // Aggregate all "use rechunk" files
      const files = await aggregateUseRechunkFiles(process.cwd());

      if (files.length === 0) {
        spinner.fail('No files containing "use rechunk" directive found.');
        return;
      }

      spinner.succeed(`Found ${files.length} files.`);

      // Prompt the user to select files to publish
      const promptMessage = `
  ${chalk.dim('Press:')}
    ${chalk.cyan('<space>')} to select an item
    ${chalk.cyan('<a>')} to toggle all selections
    ${chalk.cyan('<i>')} to invert selections
    ${chalk.cyan('<enter>')} to proceed
    `;

      const {selectedFiles} = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedFiles',
          message: `${chalk.bold('Select the components to publish:\n')}`,
          instructions: promptMessage,
          choices: files.map(file => ({
            name: ` ${chalk.cyan(file)}`,
            value: file,
          })),
          validate: choices =>
            choices.length > 0
              ? true
              : 'You must select at least one component.',
        },
      ]);

      if (selectedFiles.length === 0) {
        console.log(
          chalk.yellow('No components selected for publishing. Exiting.'),
        );
        return;
      }

      // Get ReChunk configuration
      const rc = getRechunkConfig();

      for (const file of selectedFiles) {
        const componentName = path.basename(file, path.extname(file));
        const base64String = Buffer.from(file, 'utf8').toString('base64');

        spinner.start(
          `Bundling and publishing ${componentName} as ${base64String}...`,
        );

        try {
          const input = path.resolve(process.cwd(), file);
          const rollupBuild = await rollup(await withRechunk({input}));
          const {
            output: [{code}],
          } = await rollupBuild.generate({interop: 'auto', format: 'cjs'});

          // Simulate publishing
          await publishChunk(
            rc.host,
            base64String,
            code,
            rc.project,
            rc.writeKey,
          );

          spinner.succeed(`Successfully published ${base64String}`);
        } catch (err) {
          spinner.fail(
            `Failed to publish ${base64String}: ${(err as Error).message}`,
          );

          process.exit(1);
        }
      }

      console.log(
        chalk.green(
          '\n🎉 All selected components have been published successfully!',
        ),
      );
    } catch (error) {
      spinner.fail(`Error: ${(error as Error).message}`);
    }
  });

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
