import {program} from 'commander';

/**
 * Defines a command for the "unpublish" operation using the "commander" library.
 *
 * @example
 * ```bash
 * yarn rechunk unpublish --chunk foo
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('unpublish')
  .description('unpublishes a chunk')
  .requiredOption('-c, --chunk [chunk]', 'a chunk to unpublish')
  .action(async options => {});
