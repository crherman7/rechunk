import withRechunk from '@rechunk/rollup-preset';
import chalk from 'chalk';
import {program} from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import {rollup} from 'rollup';

import {
  aggregateUseRechunkFiles,
  configureReChunkChunksApi,
  getRechunkConfig,
  LOGO,
} from '../lib';

/**
 * Registers the `publish` command to the CLI.
 *
 * This command aggregates all `.tsx` files containing the `"use rechunk"` directive,
 * prompts the user to select which components to publish, bundles the selected components
 * using Rollup, and publishes them to the ReChunk server.
 *
 * @example
 * ```bash
 * pnpm rechunk publish
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
      const files = await aggregateUseRechunkFiles(process.cwd());

      if (files.length === 0) {
        spinner.fail('No files containing "use rechunk" directive found.');
        return;
      }

      spinner.succeed(`Found ${files.length} files.`);

      const {selectedFiles} = await inquirer.prompt([
        {
          type: 'checkbox',
          theme: {
            style: {
              renderSelectedChoices: (
                selectedChoices: ReadonlyArray<{
                  value: any;
                  name: string;
                  description?: string;
                  short: string;
                  disabled: boolean | string;
                  checked: boolean;
                }>,
              ) =>
                selectedChoices
                  .map((choice, index) =>
                    index !== 0 ? `  ${choice.short}` : ` ${choice.short}`,
                  )
                  .join('\n'),
            },
          },
          name: 'selectedFiles',
          message: `${chalk.bold('Select the components to publish:\n')}`,
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

      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: `You selected ${selectedFiles.length} components. Do you want to proceed with publishing?`,
          default: true,
        },
      ]);

      if (!confirm.proceed) {
        console.log(chalk.yellow('Publishing cancelled.'));
        return;
      }

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

          await publishChunk(
            rc.host,
            base64String,
            code,
            rc.project,
            rc.writeKey,
          );

          spinner.succeed(
            `Successfully published ${componentName} as ${base64String}`,
          );
        } catch (err) {
          spinner.fail(
            `Failed to publish ${componentName}: ${(err as Error).message}`,
          );
          continue; // Continue to the next file instead of exiting
        }
      }

      console.log(
        chalk.green('\n🎉 All selected components have been processed!'),
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
  const api = configureReChunkChunksApi(host, project, writeKey);
  try {
    await api.createChunkForProject({
      projectId: project,
      chunkId: chunk,
      chunkCreate: {
        data: code,
      },
    });
  } catch (error) {
    throw new Error(`Failed to publish chunk: ${(error as Error).message}`);
  }
}
