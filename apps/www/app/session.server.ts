import {type Project} from '@prisma/client';
import {createCookieSessionStorage, redirect} from '@remix-run/node';
import invariant from 'tiny-invariant';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__rechunk_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

const PROJECT_SESSION_KEY = 'projectId';

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');

  return sessionStorage.getSession(cookie);
}

export async function getProjectId(
  request: Request,
): Promise<Project['id'] | undefined> {
  const session = await getSession(request);
  const projectId = session.get(PROJECT_SESSION_KEY);

  return projectId;
}

export async function requireProjectId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const projectId = await getProjectId(request);
  if (!projectId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);

    throw redirect(`/auth/login?${searchParams}`);
  }

  return projectId;
}

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Creates a session for a given Project ID and sets it as a cookie in the response.
 *
 * @param request - The incoming HTTP request object.
 * @param projectId - The Project ID to be stored in the session.
 * @param remember - Optional flag to determine if the session should be persistent. Defaults to `false`.
 * @param redirectTo - The URL to redirect the user to after setting the session. Defaults to the current request's pathname.
 * @returns A redirect response with the session cookie set in the headers.
 *
 * @example
 * ```typescript
 * const response = await createProjectIdSession({
 *   request,
 *   projectId: 'my-project-id',
 *   remember: true,
 *   redirectTo: '/dashboard',
 * });
 * ```
 *
 * @throws If creating or committing the session fails.
 */
export async function createProjectIdSession({
  request,
  projectId,
  remember = false,
  redirectTo = new URL(request.url).pathname,
}: {
  request: Request;
  projectId: string;
  remember?: boolean;
  redirectTo?: string;
}) {
  try {
    const session = await getSession(request);
    session.set(PROJECT_SESSION_KEY, projectId);

    // Adjust max age based on `remember` flag
    const maxAge = remember ? DEFAULT_MAX_AGE : undefined;

    return redirect(redirectTo, {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session, {
          maxAge,
        }),
      },
    });
  } catch (error) {
    console.error('Failed to create session:', error);
    throw new Error('Could not create a project session.');
  }
}

/**
 * Logs out the user by destroying their session and redirecting them to the homepage (`/`).
 *
 * @param request - The incoming HTTP request containing the session cookie.
 * @returns A `Response` object that redirects to `/` with the session cookie cleared.
 *
 * @example
 * ```typescript
 * const response = await logout(request);
 * return response;
 * ```
 */
export async function logout(request: Request) {
  const session = await getSession(request);

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}
