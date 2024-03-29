import fs from 'fs';
import path from 'path';
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
  .action(async () => {
    if (!process.env.RECHUNK_HOST) {
      throw new Error('please set RECHUNK_HOST environment variable');
    }

    // RECHUNK_USERNAME required for basicAuth in creating a new project
    if (!process.env.RECHUNK_USERNAME) {
      throw Error(
        '[RECHUNK]: RECHUNK_USERNAME environment variable not found, add RECHUNK_USERNAME to .env file.',
      );
    }

    // RECHUNK_PASSWORD required for basicAuth in creating a new project
    if (!process.env.RECHUNK_PASSWORD) {
      throw Error(
        '[RECHUNK]: RECHUNK_PASSWORD environment variable not found, add RECHUNK_PASSWORD to .env file',
      );
    }

    const ctx = process.cwd();

    const rcPath = path.resolve(ctx, 'rechunk.json');

    if (fs.existsSync(rcPath)) {
      throw new Error(
        'ReChunk project already exists, please remove rechunk.json',
      );
    }

    const res = await fetch(`${process.env.RECHUNK_HOST}/project`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(
          `${process.env.RECHUNK_USERNAME}:${process.env.RECHUNK_PASSWORD}`,
        )}`,
      },
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const json = await res.json();

    fs.writeFileSync(
      path.resolve(ctx, 'rechunk.json'),
      JSON.stringify(json, null, 2) + '\n',
    );
  });
