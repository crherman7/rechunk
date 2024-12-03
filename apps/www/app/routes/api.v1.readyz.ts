import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';

import {prisma} from '~/db.server';

/**
 * A loader function that acts as a health check endpoint for the application.
 * This function verifies the application's uptime and database connectivity
 * using Prisma's raw query capabilities.
 *
 * @returns {Promise<Response>} A JSON response indicating the application's health:
 * - `status`: `"ok"` if the application and database are healthy, otherwise `"error"`.
 * - `uptime`: The number of seconds the application has been running since the process started.
 * - `message` (optional): Error details if the database connectivity check fails.
 *
 * @example
 * ```bash
 * curl http://localhost:3000/api/v1/readyz
 * # Success Response: { "status": "ok", "uptime": 12345.67 }
 * # Error Response: { "status": "error", "message": "Database connection failed" }
 * ```
 */
export const loader: LoaderFunction = async (): Promise<Response> => {
  try {
    // Check database connectivity using Prisma
    await prisma.$queryRaw`SELECT 1`;
    return json({status: 'ok', uptime: process.uptime()}, {status: 200});
  } catch (error) {
    // Return an error response if the connectivity check fails
    return json(
      {status: 'error', message: (error as Error).message},
      {status: 500},
    );
  }
};
