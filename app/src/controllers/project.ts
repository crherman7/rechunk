import {Hono} from 'hono';
import {basicAuth} from 'hono/basic-auth';

import {readAuth} from '../middleware';

const project = new Hono();

project.get('/', readAuth(), c => {
  return c.text('ReChunk Endpoint /project GET');
});

// Use basic auth and for now it's okay to expose username and password
// In future use secrets
project.post(
  '/',
  basicAuth({username: 'rechunk', password: 'aC00Lpr0ject'}),
  c => {
    return c.text('ReChunk Endpoint /project POST');
  },
);

export default project;
