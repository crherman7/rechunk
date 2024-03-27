import {program} from 'commander';

/**
 * Defines a command for the "init" operation using the "commander" library.
 *
 * @example
 * ```bash
 * yarn rechunk init
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('init')
  .description('initializes a ReChunk project')
  .requiredOption('-h, --host [host]', 'ReChunk host')
  .action(async options => {});
