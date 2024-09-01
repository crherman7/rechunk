import {program} from 'commander';
import path from 'path';
import {rollup} from 'rollup';

import withRechunk from '../../rollup-preset';
import {getRechunkConfig, LOGO} from '../lib';

/**
 * Defines a command for the "publish" operation using the "commander" library.
 *
 * @example
 * ```bash
 * yarn rechunk publish --chunk foo
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('publish')
  .description('publishes a chunk')
  .requiredOption('-c, --chunk [chunk]', 'a chunk to publish')
  .action(async options => {
    console.log();
    console.log(LOGO);

    const {chunk} = options;

    const rc = getRechunkConfig();

    if (!rc.entry[chunk]) {
      throw new Error(
        `chunk: ${chunk} does not exist as an entry point in rechunk.json`,
      );
    }
    console.log(`🛠  Bundling ${chunk}...\n`);

    const input = path.resolve(process.cwd(), rc.entry[chunk]);
    // Rollup bundling process
    const rollupBuild = await rollup(await withRechunk({input}));

    // Generate bundled code
    const {
      output: {
        0: {code},
      },
    } = await rollupBuild.generate({});

    console.log(`🚀 Publishing ${chunk}...\n`);

    const res = await fetch(`${rc.host}/chunk/${chunk}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${rc.project}:${rc.writeKey}`)}`,
      },
      body: code,
    });

    if (!res.ok) {
      console.log(
        `❌ Oops! Something went wrong! Unable to publish ${chunk}.\n`,
      );

      return;
    }

    console.log(`🎉 Successfully published ${chunk}!\n`);
  });
