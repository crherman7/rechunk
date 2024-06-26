// app/utils/auth.ts
import {LoaderFunction, ActionFunction} from '@remix-run/node';

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    throw new Response('Unauthorized', {status: 401});
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );
  const [username, password] = credentials.split(':');

  // Replace with your actual authentication logic
  if (username !== 'admin' || password !== 'password') {
    throw new Response('Unauthorized', {status: 401});
  }

  // Return user information if needed
  return {username};
}

export const authLoader: LoaderFunction = async ({request}) => {
  return await requireAuth(request);
};

export const authAction: ActionFunction = async ({request}) => {
  return await requireAuth(request);
};
