import fs from 'fs';
import path from 'path';
import {textSync} from 'figlet';
import {program} from 'commander';

import {rollup} from 'rollup';
import image from '@rollup/plugin-image';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';

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
    console.log(textSync('ReChunk'));

    console.log();
    console.log('version: 1.0.0');
    console.log('command: publish');
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

    const babelConfigPath = path.resolve(process.cwd(), 'babel.config.js');

    if (!fs.existsSync(babelConfigPath)) {
      throw new Error(
        'babel.config.js does not exist, please make sure you are running "rechunk publish" from the root of you React Native project.',
      );
    }

    const babelConfig = require(babelConfigPath);

    const found = babelConfig?.plugins?.findIndex?.((it: unknown) => {
      if (Array.isArray(it)) {
        return (
          it[0] === 'module-resolver' ||
          it[0] === require.resolve('babel-plugin-module-resolver')
        );
      }
    });

    if (found > -1) {
      babelConfig.plugins.splice(found, 1);
    }

    const pak = require(pakPath);

    const input = path.resolve(ctx, rc.entry[chunk]);

    const rcExternal = rc.external || [];

    // Rollup bundling process
    const rollupBuild = await rollup({
      input,
      external: [...Object.keys(pak.dependencies), ...rcExternal],
      plugins: [
        image(),
        getBabelOutputPlugin({
          ...babelConfig,
        }),
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

    const res = await fetch(`${rc.host}/chunk/${chunk}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${rc.project}:${rc.writeKey}`)}`,
      },
      body: data,
    });

    if (!res.ok) {
      console.log(
        `❌ Oops! Something went wrong! Unable to publish ${chunk}.\n`,
      );

      return;
    }

    console.log(`🎉 Successfully published ${chunk}!\n`);
  });
