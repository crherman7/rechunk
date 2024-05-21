import path from 'path';
import {program} from 'commander';

import {rollup} from 'rollup';
import image from '@rollup/plugin-image';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';

import {LOGO, getBabelConfig, getPackageJson, getRechunkConfig} from '../lib';

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
    const ctx = process.cwd();

    const rc = getRechunkConfig();

    if (!rc.entry[chunk]) {
      throw new Error(
        `chunk: ${chunk} does not exist as an entry point in rechunk.json`,
      );
    }

    const babelConfig = getBabelConfig();

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

    const pak = getPackageJson();

    const input = path.resolve(ctx, rc.entry[chunk]);

    const rcExternal = rc.external || [];

    console.log(`🛠  Bundling ${chunk}...\n`);

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

    console.log(`🚀 Publishing ${chunk}...\n`);

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
