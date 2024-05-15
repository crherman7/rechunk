import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import {createHash, createSign} from 'crypto';

import {program} from 'commander';
import {rollup} from 'rollup';
import image from '@rollup/plugin-image';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';
import chalk from 'chalk';

/**
 * Defines a command for the "dev-server" operation using the "commander" library.
 * This command facilitates serving React Native chunks based upon rechunk.json.
 *
 * @example
 * ```bash
 * yarn rechunk dev-server
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('dev-server')
  .description(
    'ReChunk development server to serve and sign React Native chunks.',
  )
  .option('-p, --port [port]', 'dev server port', '3000')
  .action(async options => {
    // Importing necessary modules
    /**
     * Resolves the absolute path to the package.json file.
     * @type {string}
     */
    const pakPath = path.resolve(process.cwd(), 'package.json');

    /**
     * Resolves the absolute path to the rechunk.json file.
     * @type {string}
     */
    const rcPath = path.resolve(process.cwd(), 'rechunk.json');

    // Check if package.json exists
    if (!fs.existsSync(pakPath)) {
      throw new Error(
        '[ReChunk]: cannot find package.json. Please make sure there is a package.json at the root of your React Native project.',
      );
    }

    // Check if rechunk.json exists
    if (!fs.existsSync(rcPath)) {
      throw new Error(
        '[ReChunk]: cannot find rechunk.json. Please make sure there is a rechunk.json at the root of your React Native project.',
      );
    }

    /**
     * Contains the parsed package.json object.
     * @type {Object}
     */
    const pak = require(pakPath);

    /**
     * Contains the parsed rechunk.json object.
     * @type {Object}
     */
    const rc = require(rcPath);

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

    /**
     * Create a basic HTTP server.
     * This server dynamically bundles and serves code based on client requests.
     *
     * @param {http.IncomingMessage} req - The HTTP request object.
     * @param {http.ServerResponse} res - The HTTP response object.
     * @returns {void}
     */
    const server = http.createServer(async (req, res) => {
      // Parse the URL
      const parsedUrl = url.parse(req.url as any, true);

      // Check if the path is "/"
      if (parsedUrl.pathname === '/') {
        // Get the search parameters
        const {chunkId} = parsedUrl.query;

        if (typeof chunkId !== 'string') {
          throw new Error('[ReChunk]: chunkId must be a string.');
        }

        const input = path.resolve(process.cwd(), rc.entry[chunkId]);

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

        // Calculate SHA-256 hash of the code
        const hash = createHash('sha256').update(data).digest('hex');

        // Generate signature using private key
        const sig = createSign('SHA256')
          .update(hash)
          .sign(rc.privateKey, 'base64');

        // Prepare response data
        const responseData = {
          data,
          hash,
          sig,
        };

        // Set response headers
        res.writeHead(200, {'Content-Type': 'application/json'});

        // Send a JSON response
        res.end(JSON.stringify(responseData));
      } else {
        // For other routes, return a 404 Not Found response
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
      }
    });

    // Start the server and listen on port 3000
    server.listen(options.port, () => {
      console.log();
      console.log(chalk.blue`
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
        chalk.blue`          Welcome to ReChunk ${chalk.bold
          .white`v${pak.version}`}`,
      );
      console.log(chalk.dim`    React Native - Remote Chunks - Secure\n`);

      console.log();
      console.log('version: 1.0.0');
      console.log('command: dev-server');
      console.log();

      console.log(`👂 Server is listening on port ${options.port}`);
    });
  });
