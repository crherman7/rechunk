import {Hono} from 'hono';
import {basicAuth} from 'hono/basic-auth';

import {readAuth} from '../middleware';

// RECHUNK_USERNAME required for basicAuth in creating a new project
if (!process.env.RECHUNK_USERNAME) {
  throw Error(
    '[RECHUNK]: RECHUNK_USERNAME environment variable not found, add RECHUNK_USERNAME to .env file.',
  );
}

// RECHUNK_PASSWORD required for basicAuth in creating a new project
if (!process.env.RECHUNK_PASSWORD) {
  throw Error(
    '[RECHUNK]: RECHUNK_PASSWORD environment variable not found, add RECHUNK_PASSWORD to .env file',
  );
}

const project = new Hono();

project.get('/', readAuth(), c => {
  return c.text('ReChunk Endpoint /project GET');
});

// Use basic auth and for now it's okay to expose username and password
// In future use secrets
project.post(
  '/',
  basicAuth({
    username: process.env.RECHUNK_USERNAME,
    password: process.env.RECHUNK_PASSWORD,
  }),
  c => {
    return c.text('ReChunk Endpoint /project POST');
  },
);

export default project;
