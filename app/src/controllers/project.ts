import {Hono} from 'hono';

const project = new Hono();

project.get('/', c => {
  return c.text('ReChunk Endpoint /project GET');
});

project.post('/', c => {
  return c.text('ReChunk Endpoint /project POST');
});

export default project;
