import fs from 'fs';
import path from 'path';
import {textSync} from 'figlet';
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
  .action(async options => {
    console.log(textSync('ReChunk'));

    const {version} = require('../../package.json');

    console.log();
    console.log(`version: ${version}`);
    console.log('command: unpublish');
    console.log();

    const {chunk} = options;
    const ctx = process.cwd();

    const rcPath = path.resolve(ctx, 'rechunk.json');

    if (!fs.existsSync(rcPath)) {
      throw new Error(
        'project does not exist, please run "rechunk init" to create rechunk.json',
      );
    }

    const rc = require(rcPath);

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
