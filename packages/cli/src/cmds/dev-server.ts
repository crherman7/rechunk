import withRechunk from '@rechunk/rollup-preset';
import chalk from 'chalk';
import {program} from 'commander';
import {createHash} from 'crypto';
import http, {IncomingMessage, ServerResponse} from 'http';
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
const PORT = 49904;

/**
 * Defines a command for the "dev-server" operation using the "commander" library.
 * This command facilitates serving React Native chunks based on `.rechunkrc.json`.
 *
 * @example
 * ```bash
 * pnpm rechunk dev-server
 * ```
 */
program
  .command('dev-server')
  .description(
    'ReChunk development server to serve and sign React Native chunks.',
  )
  .action(() => {
    const rc = getRechunkConfig();
    startDevServer(rc);
  });

/**
 * Starts the development server to serve chunks dynamically based on incoming requests.
 *
 * @param rc - The ReChunk configuration object.
 */
function startDevServer(rc: ReturnType<typeof getRechunkConfig>): void {
  const server = http.createServer((req, res) => handleRequest(req, res, rc));

  server.listen(PORT, () => {
    console.log();
    console.log(LOGO);
    console.log(
      `    ${chalk.green`→`} host: http://localhost
    ${chalk.green`→`} port: ${PORT}
    ${chalk.green`→`} path: /projects/:project/chunks/:chunkId`,
    );
    console.log();
  });
}

/**
 * Handles incoming HTTP requests, processing and serving chunks based on the URL.
 *
 * @param req - The incoming HTTP request.
 * @param res - The outgoing HTTP response.
 * @param rc - The ReChunk configuration object.
 */
async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  rc: ReturnType<typeof getRechunkConfig>,
): Promise<void> {
  const {projectId, chunkId} = parseUrl(req.url);

  if (!chunkId) {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Bad Request');

    return;
  }

  console.log(
    `${chalk.green`    ⑇`} ${new Date().toISOString()}: Serving /projects/${projectId}/chunks/${chunkId}`,
  );

  try {
    const decodeChunkId = Buffer.from(chunkId, 'base64').toString('utf-8');
    const code = await bundleChunk(decodeChunkId);
    const token = generateToken(code, rc.privateKey);

    sendJsonResponse(res, {token, data: code});
  } catch (error) {
    logError(res, (error as Error).message);
  }
}

/**
 * Parses the request URL to extract the project ID and chunk ID.
 *
 * @param requestUrl - The incoming request URL.
 * @returns An object containing `projectId` and `chunkId`.
 * @throws {Error} If the URL cannot be parsed.
 */
function parseUrl(requestUrl: string | undefined): {
  projectId: string;
  chunkId: string;
} {
  const parsedUrl = url.parse(requestUrl || '', true);
  const matches = parsedUrl.pathname?.match(/\/projects\/(.*)\/chunks\/(\w+)/);

  if (!matches) {
    throw new Error('[ReChunk]: Unable to parse URL');
  }

  return {projectId: matches[1], chunkId: matches[2]};
}

/**
 * Bundles the specified chunk using Rollup.
 *
 * @param entryPath - The file path for the chunk entry point.
 * @returns A promise resolving to the bundled code as a string.
 * @throws {Error} If bundling fails.
 */
async function bundleChunk(entryPath: string): Promise<string> {
  const input = path.resolve(process.cwd(), entryPath);
  const rollupBuild = await rollup(await withRechunk({input}));
  const {
    output: [{code}],
  } = await rollupBuild.generate({interop: 'auto', format: 'cjs'});

  return code;
}

/**
 * Generates a signed token for the chunk using the private key.
 *
 * @param code - The bundled code for which to generate the token.
 * @param privateKey - The private key to sign the token.
 * @returns The signed token.
 */
function generateToken(code: string, privateKey: string): string {
  const prvKey = KEYUTIL.getKey(privateKey) as RSAKey;
  const sPayload = createHash('sha256').update(code).digest('hex');

  return KJUR.jws.JWS.sign(
    'RS256',
    JSON.stringify({alg: 'RS256'}),
    sPayload,
    prvKey,
  );
}

/**
 * Sends a JSON response to the client.
 *
 * @param res - The outgoing HTTP response.
 * @param data - The data to send as a JSON response.
 */
function sendJsonResponse(
  res: ServerResponse,
  data: Record<string, unknown>,
): void {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(data));
}

/**
 * Logs an error message and sends a 500 response to the client.
 *
 * @param res - The outgoing HTTP response.
 * @param message - The error message to log and send.
 */
function logError(res: ServerResponse, message: string): void {
  console.error(`❌ Error: ${message}`);

  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end(`Server Error: ${message}`);
}
