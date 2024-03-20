const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs/promises');
const {createHash, createSign} = require('node:crypto');

const {rollup} = require('rollup');
const image = require('@rollup/plugin-image');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');

const pak = require('../package.json');

// Create a basic HTTP server
const server = http.createServer(async (req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);

  // Check if the path is "/"
  if (parsedUrl.pathname === '/') {
    // Get the search parameters
    const {chunkId} = parsedUrl.query;

    const {bundleRequire} = await import('bundle-require');

    const {mod} = await bundleRequire({
      filepath: path.resolve(process.cwd(), 'rechunk.config.ts'),
      format: 'cjs',
    });

    const input = path.resolve(process.cwd(), mod.default.entry[chunkId]);

    const rollupRes = await rollup({
      input,
      external: Object.keys(pak.dependencies),
      plugins: [
        resolve(),
        commonjs(),
        image(),
        typescript({
          compilerOptions: {
            target: 'es6',
            jsx: 'react',
            module: 'es6',
            allowSyntheticDefaultImports: true,
          },
        }),
        terser(),
      ],
    });

    const {
      output: {
        0: {code},
      },
    } = await rollupRes.generate({format: 'cjs', exports: 'auto'});

    const privateKey = await fs.readFile(
      path.resolve(process.cwd(), mod.default.privateKeyPath),
      'utf-8',
    );

    const data = btoa(code);
    const hash = createHash('sha256').update(data).digest('hex');

    // Prepare response object
    const responseData = {
      data,
      hash,
      sig: createSign('SHA256').update(hash).sign(privateKey, 'base64'),
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
