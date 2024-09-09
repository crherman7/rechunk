import {and, eq} from 'drizzle-orm';
import {MiddlewareHandler} from 'hono';
import {HTTPException} from 'hono/http-exception';

import {db} from '../db';
import {projects} from '../db/schema';
import {auth} from './auth';

export const readAuth = (): MiddlewareHandler => {
  return async function readAuth(c, next) {
    const requestUser = auth(c.req);

    const project = requestUser?.username;
    const readKey = requestUser?.password;

    if (!project) {
      throw new HTTPException(400, {
        message: 'read auth middleware requires "project" query parameter',
      });
    }

    if (!readKey) {
      throw new HTTPException(400, {
        message: 'read auth middleware requires "readKey" query parameter',
      });
    }

    const res = await db.query.projects.findFirst({
      where: and(eq(projects.name, project), eq(projects.readKey, readKey)),
    });

    if (!res) {
      throw new HTTPException(401, {
        message:
          'read auth middleware contains a "project" or "readKey" mismatch',
      });
    }

    c.set('project', res);

    await next();

    return;
  };
};
