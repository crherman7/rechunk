import {Hono} from 'hono';

const root = new Hono();

root.get('/', c => {
  return c.json({message: 'ReChunk!'}, 200);
});

export default root;
