import {and, eq} from 'drizzle-orm';
import {MiddlewareHandler} from 'hono';
import {getCookie} from 'hono/cookie';

import {db} from '../db';
import {projects} from '../db/schema';

export const readAuth = (): MiddlewareHandler => {
  return async function readAuth(c, next) {
    const project = getCookie(c, 'rechunk_project');
    const readKey = getCookie(c, 'rechunk_read_key');

    if (!project) {
      throw new Error(
        'read auth middleware requires "project" query parameter',
      );
    }

    if (!readKey) {
      throw new Error(
        'read auth middleware requires "readKey" query parameter',
      );
    }

    const res = await db.query.projects.findFirst({
      where: and(eq(projects.name, project), eq(projects.readKey, readKey)),
    });

    if (!res) {
      throw new Error(
        'read auth middleware contains a "project" or "readKey" mismatch',
      );
    }

    c.set('project', res);

    await next();

    return;
  };
};
