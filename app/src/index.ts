// Importing required modules
import {Hono} from 'hono'; // Importing Hono from 'hono' package
import {serve} from '@hono/node-server'; // Importing serve function from '@hono/node-server' package

import {chunk, project} from './controllers'; // Importing chunk and project functions from './controllers' module

// Creating a new instance of Hono
const app = new Hono(); // Creating a new instance of the Hono class

/**
 * Handles GET requests to the root endpoint.
 * @param {Object} c - The request context object.
 * @returns {string} - A welcome message.
 */
app.get('/', c => {
  return c.text('Welcome to ReChunk!'); // Returning a welcome message when accessing the root endpoint
});

// Routing endpoints to specific controller functions
app.route('/chunk', chunk); // Routing '/chunk' endpoint to the chunk controller function
app.route('/project', project); // Routing '/project' endpoint to the project controller function

// Setting up the port for the server
const port = 3000; // Setting the port number to 3000

// Logging the server's port number
console.log(`Server is running on port ${port}`); // Logging a message indicating the server is running on the specified port

// Starting the server
serve({
  fetch: app.fetch, // Passing the fetch method of the app instance to serve function
  port, // Passing the port number to serve function
});
