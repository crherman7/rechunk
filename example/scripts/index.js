const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs/promises');
const {createHash, createSign} = require('crypto');

const {rollup} = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const image = require('@rollup/plugin-image');
const resolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');

const pak = require('../package.json');
const rc = require('../rechunk.config.json');

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
  const parsedUrl = url.parse(req.url, true);

  // Check if the path is "/"
  if (parsedUrl.pathname === '/') {
    // Get the search parameters
    const {chunkId} = parsedUrl.query;

    const input = path.resolve(process.cwd(), rc.entry[chunkId]);

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

    // Read private key from file
    const privateKey = await fs.readFile(
      path.resolve(process.cwd(), rc.privateKeyPath),
      'utf-8',
    );

    // Encode code as base64
    const data = btoa(code);

    // Calculate SHA-256 hash of the code
    const hash = createHash('sha256').update(data).digest('hex');

    // Generate signature using private key
    const sig = createSign('SHA256').update(hash).sign(privateKey, 'base64');

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
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
