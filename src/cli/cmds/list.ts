import Table from 'cli-table3';
import {program} from 'commander';

import {getRechunkConfig, LOGO} from '../lib';

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
  .action(async () => {
    console.log();
    console.log(LOGO);

    const rc = getRechunkConfig();

    const res = await fetch(`${rc.host}/project`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${btoa(`${rc.project}:${rc.readKey}`)}`,
      },
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const json = await res.json();

    const chunks = json.chunks.map((it: any) =>
      Object.values({
        id: it.id,
        chunkName: it.name,
        projectName: json.name,
        timestamp: it.timestamp,
      }),
    );

    var table = new Table({
      head: ['Chunk ID', 'Chunk Name', 'Project', 'Created'],
      style: {
        head: [],
        border: [],
      },
    });

    table.push(...chunks);

    console.log();
    console.log(table.toString());
    console.log();
  });
