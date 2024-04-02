import {program} from 'commander';
import path from 'path';
import fs from 'fs';

import {rollup} from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

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
    const {chunk} = options;
    const ctx = process.cwd();

    const rcPath = path.resolve(ctx, 'rechunk.json');

    if (!fs.existsSync(rcPath)) {
      throw new Error(
        'project does not exist, please run "rechunk init" to create rechunk.json',
      );
    }

    const rc = require(rcPath);

    if (!rc.entry[chunk]) {
      throw new Error(
        `chunk: ${chunk} does not exist as an entry point in rechunk.json`,
      );
    }

    const pakPath = path.resolve(process.cwd(), 'package.json');

    if (!fs.existsSync(pakPath)) {
      throw new Error(
        'package.json does not exist, please make sure you are running "rechunk publish" from the root of you React Native project.',
      );
    }

    const pak = require(pakPath);

    const input = path.resolve(ctx, rc.entry[chunk]);

    const rcExternal = rc.external || [];

    // Rollup bundling process
    const rollupBuild = await rollup({
      input,
      external: [...Object.keys(pak.dependencies), ...rcExternal],
      plugins: [
        resolve(),
        commonjs(),
        image(),
        typescript({
          compilerOptions: {
            jsx: 'react',
            allowSyntheticDefaultImports: true,
          },
        }),
        terser(),
      ],
      logLevel: 'silent',
    });

    // Generate bundled code
    const {
      output: {
        0: {code},
      },
    } = await rollupBuild.generate({format: 'cjs', exports: 'auto'});

    // Encode code as base64
    const data = btoa(code);

    await fetch(`${rc.host}/chunk/${chunk}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${rc.project}:${rc.writeKey}`)}`,
      },
      body: data,
    });
  });
