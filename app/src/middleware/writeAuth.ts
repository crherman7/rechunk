import {and, eq} from 'drizzle-orm';
import {MiddlewareHandler} from 'hono';

import {db} from '../db';
import {projects} from '../db/schema';
import {getCookie} from 'hono/cookie';

export const writeAuth = (): MiddlewareHandler => {
  return async function writeAuth(c, next) {
    const project = getCookie(c, 'rechunk_project');
    const writeKey = getCookie(c, 'rechunk_write_key');

    if (!project) {
      throw new Error(
        'read auth middleware requires "project" query parameter',
      );
    }

    if (!writeKey) {
      throw new Error(
        'read auth middleware requires "writeKey" query parameter',
      );
    }

    const res = await db.query.projects.findFirst({
      where: and(eq(projects.name, project), eq(projects.writeKey, writeKey)),
    });

    if (!res) {
      throw new Error(
        'read auth middleware contains a "project" or "writeKey" mismatch',
      );
    }

    c.set('project', res);

    await next();

    return;
  };
};
