import {Hono} from 'hono';

const root = new Hono();

root.get('/', c => {
  return c.text('Welcome to ReChunk!');
});

export default root;
