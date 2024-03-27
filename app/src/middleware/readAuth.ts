import {MiddlewareHandler} from 'hono';

export const readAuth = (): MiddlewareHandler => {
  return async function readAuth(c, next) {
    await next();

    return;
  };
};
