import {and, eq} from 'drizzle-orm';
import {MiddlewareHandler} from 'hono';
import {HTTPException} from 'hono/http-exception';

import {db} from '../db';
import {projects} from '../db/schema';
import {auth} from './auth';

export const writeAuth = (): MiddlewareHandler => {
  return async function writeAuth(c, next) {
    const requestUser = auth(c.req);

    const project = requestUser?.username;
    const writeKey = requestUser?.password;

    if (!project) {
      throw new HTTPException(400, {
        message: 'read auth middleware requires "project" query parameter',
      });
    }

    if (!writeKey) {
      throw new HTTPException(400, {
        message: 'read auth middleware requires "writeKey" query parameter',
      });
    }

    const res = await db.query.projects.findFirst({
      where: and(eq(projects.name, project), eq(projects.writeKey, writeKey)),
    });

    if (!res) {
      throw new HTTPException(401, {
        message:
          'read auth middleware contains a "project" or "writeKey" mismatch',
      });
    }

    c.set('project', res);

    await next();

    return;
  };
};
