import {Hono} from 'hono';

import {readAuth} from '../middleware';

const project = new Hono();

project.get('/', readAuth(), c => {
  return c.text('ReChunk Endpoint /project GET');
});

project.post('/', c => {
  return c.text('ReChunk Endpoint /project POST');
});

export default project;
