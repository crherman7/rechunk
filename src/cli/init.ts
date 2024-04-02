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
  .requiredOption('-h, --host [host]', 'host of your rechunk server')
  .requiredOption(
    '-u, --username [username]',
    'username of your rechunk server init endpoint for basic auth',
  )
  .requiredOption(
    '-p, --password [password]',
    'password of your rechunk server init endpoint for basic auth',
  )
  .action(async options => {
    const {host, username, password} = options;

    if (
      !(host as string).match(
        /^http(|s):\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/,
      )
    ) {
      throw new Error(
        'host does not match the URL schema i.e. https://rechunk.onrender.com, https://localhost:3000, etc.',
      );
    }

    const ctx = process.cwd();

    const rcPath = path.resolve(ctx, 'rechunk.json');

    if (fs.existsSync(rcPath)) {
      throw new Error('project already exists, please remove rechunk.json');
    }

    const res = await fetch(`${host}/project`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const json = await res.json();

    fs.writeFileSync(
      path.resolve(ctx, 'rechunk.json'),
      JSON.stringify({...json, host}, null, 2) + '\n',
    );
  });
