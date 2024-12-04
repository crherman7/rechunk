import {ActionFunctionArgs, redirect} from '@remix-run/node';

import {logout} from '~/session.server';

/**
 * Handles the `POST` request to log the user out by destroying their session.
 *
 * @param request - The incoming HTTP request containing session information.
 * @returns A `Response` object with the session cookie cleared.
 *
 * @example
 * ```tsx
 * <Form method="post" action="/auth/logout">
 *   <button type="submit" />
 * </Form>
 * ```
 */
export const action = async ({request}: ActionFunctionArgs) => logout(request);

/**
 * Handles the `GET` request by redirecting the user to the homepage.
 * This ensures no unintended access to the `/logout` route directly.
 *
 * @returns A redirection response to the homepage (`/`).
 */
export const loader = async () => redirect('/');
