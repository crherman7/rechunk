import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';

/**
 * A loader function that acts as a simple liveness probe for the application.
 * It returns the current status of the application along with its uptime.
 *
 * @returns {Promise<Response>} A JSON response containing:
 * - `status`: Indicates the application's status, which is always `'ok'`.
 * - `uptime`: The number of seconds the application has been running since the process started.
 *
 * @example
 * ```bash
 * curl http://localhost:3000/api/v1/livez
 * # Response: { "status": "ok", "uptime": 12345.67 }
 * ```
 */
export const loader: LoaderFunction = async (): Promise<Response> => {
  return json({status: 'ok', uptime: process.uptime()}, {status: 200});
};
