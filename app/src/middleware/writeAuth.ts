import {MiddlewareHandler} from 'hono';

export const writeAuth = (): MiddlewareHandler => {
  return async function writeAuth(c, next) {
    await next();

    return;
  };
};
