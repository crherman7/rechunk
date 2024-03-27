import {program} from 'commander';

/**
 * Defines a command for the "list" operation using the "commander" library.
 *
 * @example
 * ```bash
 * yarn rechunk list
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('list')
  .description('list all published chunks')
  .action(async options => {});
