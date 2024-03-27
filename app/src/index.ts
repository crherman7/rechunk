import {Hono} from 'hono';
import {serve} from '@hono/node-server';

import {chunk, project} from './controllers';

const app = new Hono();

app.get('/', c => {
  return c.text('Welcome to ReChunk!');
});

app.route('/chunk', chunk);
app.route('/project', project);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
