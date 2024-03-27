import {Hono} from 'hono';

const chunk = new Hono();

chunk.get('/', c => {
  return c.text('ReChunk Endpoint /chunk GET');
});

chunk.post('/', c => {
  return c.text('ReChunk Endpoint /chunk POST');
});

chunk.delete('/', c => {
  return c.text('ReChunk Endpoint /chunk DELETE');
});

export default chunk;
