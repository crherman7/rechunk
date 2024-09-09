import crypto from 'crypto';
import {and, eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {HTTPException} from 'hono/http-exception';

import {db} from '../db';
import {chunks, Project} from '../db/schema';
import {readAuth, writeAuth} from '../middleware';

type Variables = {
  project: Project;
};

const chunk = new Hono<{Variables: Variables}>();

chunk.get('/:chunkId', readAuth(), async c => {
  const project = c.get('project');
  const chunkId = c.req.param('chunkId');

  const chunk = await db.query.chunks.findFirst({
    where: and(eq(chunks.name, chunkId), eq(chunks.projectId, project.id)),
  });

  if (!chunk) {
    throw new HTTPException(404, {message: `chunkId: ${chunkId} not found`});
  }

  const hash = crypto.createHash('sha256').update(chunk.data).digest('hex');

  const sig = crypto
    .createSign('SHA256')
    .update(hash)
    .sign(project.privateKey, 'base64');

  return c.json(
    {
      data: chunk.data,
      hash,
      sig,
    },
    200,
  );
});

chunk.post('/:chunkId', writeAuth(), async c => {
  const project = c.get('project');
  const chunkId = c.req.param('chunkId');

  const chunk = await db.query.chunks.findFirst({
    where: and(eq(chunks.name, chunkId), eq(chunks.projectId, project.id)),
  });

  const data = await c.req.text();

  if (!chunk) {
    await db.insert(chunks).values({
      data,
      name: chunkId,
      projectId: project.id,
    });

    return c.json({messsage: 'Created!'}, 201);
  }

  await db
    .update(chunks)
    .set({data})
    .where(and(eq(chunks.name, chunkId), eq(chunks.projectId, project.id)));

  return c.json({messsage: 'Updated!'}, 201);
});

chunk.delete('/:chunkId', writeAuth(), async c => {
  const project = c.get('project');
  const chunkId = c.req.param('chunkId');

  await db
    .delete(chunks)
    .where(and(eq(chunks.name, chunkId), eq(chunks.projectId, project.id)));

  return c.json({message: 'Deleted!'}, 200);
});

export default chunk;
