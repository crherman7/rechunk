import {Hono} from 'hono';

import {readAuth, writeAuth} from '../middleware';

const chunk = new Hono();

chunk.get('/', readAuth(), c => {
  return c.text('ReChunk Endpoint /chunk GET');
});

chunk.post('/', writeAuth(), c => {
  return c.text('ReChunk Endpoint /chunk POST');
});

chunk.delete('/', readAuth(), c => {
  return c.text('ReChunk Endpoint /chunk DELETE');
});

export default chunk;
