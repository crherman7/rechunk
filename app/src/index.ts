import 'dotenv/config';

import {serve} from '@hono/node-server';
import {Hono} from 'hono';

import {chunk, project, root} from './controllers';

// Creating a new instance of Hono
const app = new Hono();

// Routing endpoints to specific controller functions
app.route('/', root);
app.route('/chunk', chunk); // Routing '/chunk' endpoint to the chunk controller function
app.route('/project', project); // Routing '/project' endpoint to the project controller function

// Setting up the port for the server
const port = 3000;

// Logging the server's port number
console.log(`Server is running on port ${port}`);

// Starting the server
serve({
  fetch: app.fetch, // Passing the fetch method of the app instance to serve function
  port, // Passing the port number to serve function
});
