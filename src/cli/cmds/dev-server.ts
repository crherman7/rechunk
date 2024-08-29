import chalk from 'chalk';
import {program} from 'commander';
import {createHash, createSign} from 'crypto';
import fs from 'fs';
import http from 'http';
import path from 'path';
import prettier from 'prettier';
import {rollup} from 'rollup';
import url from 'url';

import withRechunk from '../../rollup-preset';
import {getRechunkConfig, LOGO} from '../lib';

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
  .action(async () => {
    const {default: getPort} = await import('get-port');

    const port = await getPort();
    const rc = getRechunkConfig();

    function updateRechunkConfig(config: Object) {
      fs.writeFileSync(
        path.resolve(process.cwd(), 'rechunk.json'),
        prettier.format(JSON.stringify(config), {
          parser: 'json',
          bracketSpacing: false,
        }),
        'utf-8',
      );
    }

    updateRechunkConfig({...rc, host: `http://localhost:${port}`});

    // CTRL+C
    process.on('SIGINT', () => {
      updateRechunkConfig(rc);

      process.exit(0);
    });

    // Keyboard quit
    process.on('SIGQUIT', () => {
      updateRechunkConfig(rc);

      process.exit(0);
    });

    // `kill` command
    process.on('SIGTERM', () => {
      updateRechunkConfig(rc);

      process.exit(0);
    });

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
      if (/\/chunk\/(\w+)/.test(parsedUrl.pathname || '')) {
        // Get the search parameters
        const matches = parsedUrl.path?.match(/\/chunk\/(\w+)/);

        if (!matches) {
          throw new Error('[ReChunk]: cannot parse url');
        }

        const chunkId = matches[1];

        console.log(
          `${chalk.green`    ⑇`} ${new Date().toISOString()}: serving /chunk/${chunkId}`,
        );

        if (typeof chunkId !== 'string') {
          throw new Error('[ReChunk]: chunkId must be a string.');
        }

        const input = path.resolve(process.cwd(), rc.entry[chunkId]);
        // Rollup bundling process
        const rollupBuild = await rollup(await withRechunk({input}));

        // Generate bundled code
        const {
          output: {
            0: {code},
          },
        } = await rollupBuild.generate({});

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
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Bad Request');
      }
    });

    // Start the server and listen on port 18538
    server.listen(port, () => {
      console.log();
      console.log(LOGO);
      console.log(
        `    ${chalk.green`→`} host: http://localhost
    ${chalk.green`→`} port: ${port}
    ${chalk.green`→`} path: /chunk/:chunkId`,
      );
      console.log();
    });
  });
