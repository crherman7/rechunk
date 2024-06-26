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
  const userId = session.get(PROJECT_SESSION_KEY);

  return userId;
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

export async function createUserSession({
  request,
  userId,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(PROJECT_SESSION_KEY, userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}
