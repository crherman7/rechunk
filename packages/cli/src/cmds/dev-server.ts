import withRechunk from '@crherman7/rechunk-rollup-preset';
import chalk from 'chalk';
import {program} from 'commander';
import {createHash} from 'crypto';
import http from 'http';
import {KEYUTIL, KJUR, RSAKey} from 'jsrsasign';
import path from 'path';
import {rollup} from 'rollup';
import url from 'url';

import {getRechunkConfig, LOGO} from '../lib';

/**
 * Generates a port number based on the string "rechunk" by mapping it to an ephemeral port.
 *
 * The port selection process involves the following steps:
 *
 * 1. **ASCII Value Conversion**: Each character in the string "rechunk" is converted to its corresponding
 *    ASCII value:
 *    - 'r' -> 114
 *    - 'e' -> 101
 *    - 'c' -> 99
 *    - 'h' -> 104
 *    - 'u' -> 117
 *    - 'n' -> 110
 *    - 'k' -> 107
 *
 * 2. **Summation**: The ASCII values are summed together:
 *    - Total = 114 + 101 + 99 + 104 + 117 + 110 + 107 = 752
 *
 * 3. **Modulo Operation**: The sum is then mapped to the ephemeral port range (49152 to 65535) using
 *    the modulo operation:
 *    - Size of the ephemeral port range = 65535 - 49152 = 16383
 *    - Remainder = 752 % 16383 = 752 (since 752 is less than 16383)
 *
 * 4. **Port Calculation**: The final port number is obtained by adding the remainder to the start of
 *    the ephemeral port range:
 *    - Final Port = 49152 + 752 = 49904
 *
 * The chosen port number (49904) falls within the ephemeral port range and is derived uniquely
 * from the string "rechunk".
 *
 * @returns {number} The generated ephemeral port number based on the string "rechunk".
 */
const PORT = '49904';

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
    const rc = getRechunkConfig();

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
      if (/\/projects\/.*\/chunks\/(\w+)/.test(parsedUrl.pathname || '')) {
        // Get the search parameters
        const matches = parsedUrl.path?.match(
          /\/projects\/(.*)\/chunks\/(\w+)/,
        );

        if (!matches) {
          throw new Error('[ReChunk]: cannot parse url');
        }

        const projectId = matches[1];
        const chunkId = matches[2];

        console.log(
          `${chalk.green`    ⑇`} ${new Date().toISOString()}: serving /projects/${projectId}/chunk/${chunkId}`,
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

        const prvKey = KEYUTIL.getKey(rc.privateKey) as RSAKey;
        const sPayload = createHash('sha256').update(code).digest('hex');
        const token = KJUR.jws.JWS.sign(
          'RS256',
          JSON.stringify({alg: 'RS256'}),
          sPayload,
          prvKey,
        );

        // Prepare response data
        const responseData = {
          token,
          data: code,
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
    server.listen(PORT, () => {
      console.log();
      console.log(LOGO);
      console.log(
        `    ${chalk.green`→`} host: http://localhost
    ${chalk.green`→`} port: ${PORT}
    ${chalk.green`→`} path: /projects/:project/chunk/:chunkId`,
      );
      console.log();
    });
  });
