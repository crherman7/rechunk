import crypto from 'crypto';
import {eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {basicAuth} from 'hono/basic-auth';
import namor from 'namor';

import {db} from '../db';
import {Project, projects} from '../db/schema';
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

type Variables = {
  project: Project;
};

const project = new Hono<{Variables: Variables}>();

project.get('/', readAuth(), async c => {
  const project = c.get('project');

  const res = await db.query.projects.findFirst({
    where: eq(projects.id, project.id),
    columns: {
      id: true,
      name: true,
      timestamp: true,
    },
    with: {
      chunks: {
        columns: {
          id: true,
          name: true,
          timestamp: true,
        },
      },
    },
  });

  return c.json(res, 200);
});

project.post(
  '/',
  basicAuth({
    username: process.env.RECHUNK_USERNAME,
    password: process.env.RECHUNK_PASSWORD,
  }),
  async c => {
    const project = namor.generate({words: 3});
    const readKey = `read-${crypto.randomUUID()}`;
    const writeKey = `write-${crypto.randomUUID()}`;
    const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    const pub = publicKey.export({type: 'spki', format: 'pem'}) as string;
    const priv = privateKey.export({type: 'pkcs8', format: 'pem'}) as string;

    await db.insert(projects).values({
      name: project,
      readKey,
      writeKey,
      publicKey: pub,
      privateKey: priv,
    });

    return c.json(
      {
        $schema: 'https://crherman7.github.io/rechunk/schema.json',
        project,
        readKey,
        writeKey,
        publicKey: pub,
        privateKey: priv,
        entry: {},
        external: [],
      },
      201,
    );
  },
);

export default project;
