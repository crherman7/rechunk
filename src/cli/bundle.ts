import {Option, program} from 'commander';

/**
 * Defines a command for the "bundle" operation using the "commander" library.
 * This command facilitates the bundling of React Native chunks based upon rechunk.config.json.
 *
 * @example
 * ```bash
 * yarn rechunk bundle
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('bundle')
  .description('ReChunk command to bundle React Native components')
  .option('-c, --config', 'relative path to rechunk configuration')
  .action(async options => {});
