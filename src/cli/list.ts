import fs from 'fs';
import path from 'path';
import Table from 'cli-table3';
import {program} from 'commander';
import chalk from 'chalk';

import pak from '../../package.json';

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
    console.log(chalk.green`
          ░░░░░░░░░░░░░░░░░░░░░░        
          ░░░░░░░░░░░░░░░░░░░░░░        
          ░░░░░░░░░░░░░░░░░░░░░░        
          ░░░░░░░░░░░░░░░░░░░░░░        
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░        
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░        
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░        
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░▓▓▓▓▓▓▓▓
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░▓▓▓▓▓▓▓▓
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓
      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓
                 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                   `);
    console.log(
      chalk.green`          Welcome to ReChunk ${chalk.bold
        .white`v${pak.version}`}`,
    );
    console.log(chalk.dim`    React Native - Remote Chunks - Secure\n`);

    const ctx = process.cwd();

    const rcPath = path.resolve(ctx, 'rechunk.json');

    if (!fs.existsSync(rcPath)) {
      throw new Error(
        'project does not exist, please run "rechunk init" to create rechunk.json',
      );
    }

    const rc = require(rcPath);

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
