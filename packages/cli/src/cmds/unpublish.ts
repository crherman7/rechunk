import {program} from 'commander';

import {getRechunkConfig, LOGO} from '../lib';

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
  .action(async options => {
    console.log();
    console.log(LOGO);

    const {chunk} = options;

    const rc = getRechunkConfig();

    console.log(`🔫 Unpublishing ${chunk}...\n`);

    const res = await fetch(`${rc.host}/chunk/${chunk}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${btoa(`${rc.project}:${rc.writeKey}`)}`,
      },
    });

    if (!res.ok) {
      console.log(
        `❌ Oops! Something went wrong! Unable to unpublish ${chunk}.\n`,
      );

      return;
    }

    console.log(`🎉 Successfully unpublished ${chunk}!\n`);
  });
