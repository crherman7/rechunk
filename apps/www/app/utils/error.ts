// app/utils/errorHandler.ts
import {json} from '@remix-run/node';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleError(error: any, status: number = 500) {
  console.error(error);
  return json({error: error.message || 'Internal Server Error'}, {status});
}
