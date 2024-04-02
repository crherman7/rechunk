import {Hono} from 'hono';
import crypto from 'crypto';
import {and, eq} from 'drizzle-orm';

import {db} from '../db';
import {Project, chunks} from '../db/schema';
import {readAuth, writeAuth} from '../middleware';

type Variables = {
  project: Project;
};

const chunk = new Hono<{Variables: Variables}>();

chunk.get('/:chunkId', readAuth(), async c => {
  const project = c.get('project');
  const chunkId = c.req.param('chunkId');

  const chunk = await db.query.chunks.findFirst({
    where: eq(chunks.name, chunkId),
  });

  if (!chunk) {
    throw new Error(`cannot find chunk for chunkdId: ${chunkId}`);
  }

  const hash = crypto.createHash('sha256').update(chunk.data).digest('hex');

  const sig = crypto
    .createSign('SHA256')
    .update(hash)
    .sign(project.privateKey, 'base64');

  return c.json({
    data: chunk.data,
    hash,
    sig,
  });
});

chunk.post('/:chunkId', writeAuth(), async c => {
  const project = c.get('project');
  const chunkId = c.req.param('chunkId');

  const chunk = await db.query.chunks.findFirst({
    where: eq(chunks.name, chunkId),
  });

  const data = await c.req.text();

  if (!chunk) {
    await db.insert(chunks).values({
      data,
      name: chunkId,
      projectId: project.id,
    });

    return c.text('');
  }

  await db.update(chunks).set({data}).where(eq(chunks.name, chunkId));

  return c.text('');
});

chunk.delete('/:chunkId', writeAuth(), async c => {
  const project = c.get('project');
  const chunkId = c.req.param('chunkId');

  await db
    .delete(chunks)
    .where(and(eq(chunks.name, chunkId), eq(chunks.projectId, project.id)));

  return c.text('');
});

export default chunk;
