import {prisma} from '~/db.server';

/**
 * Static credentials for basic authentication.
 *
 * @remarks
 * These values are currently hardcoded for minimal protection.
 * For security, it's recommended to move them to environment variables in a `.env` file
 * (e.g., `process.env.BASIC_AUTH_USERNAME` and `process.env.BASIC_AUTH_PASSWORD`)
 * to avoid exposing sensitive information in the codebase.
 */
const BASIC_AUTH_USERNAME = 'admin';
const BASIC_AUTH_PASSWORD = 'password123';

/**
 * Validates the basic auth credentials against static values.
 *
 * @param request - The incoming request with the Authorization header.
 * @returns A promise that resolves if credentials are valid, otherwise throws an unauthorized response.
 */
export async function requireBasicAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    throw new Response('Unauthorized', {status: 401});
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );
  const [username, password] = credentials.split(':');

  // Check if credentials match the static values
  if (username !== BASIC_AUTH_USERNAME || password !== BASIC_AUTH_PASSWORD) {
    throw new Response('Unauthorized', {status: 401});
  }

  // If successful, return a basic object or message
  return {message: 'Basic authentication successful'};
}

/**
 * Helper function to validate a project key.
 *
 * @param request - The incoming request with the Authorization header.
 * @param keyType - The type of key to validate ('readKey' or 'writeKey').
 * @returns Project information if authentication is successful.
 */
async function validateProjectKey(
  request: Request,
  keyType: 'readKey' | 'writeKey',
) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    throw new Response('Unauthorized', {status: 401});
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );
  const [projectId, key] = credentials.split(':');

  const project = await prisma.project.findUnique({
    where: {id: projectId},
  });

  if (!project || project[keyType] !== key) {
    throw new Response('Unauthorized', {status: 401});
  }

  return {projectId: project.id};
}

// Factory function to create access functions for either read or write access
function createAccessFunctions(keyType: 'readKey' | 'writeKey') {
  const requireAccess = (request: Request) =>
    validateProjectKey(request, keyType);

  return {requireAccess};
}

// Create read and write access functions
export const {requireAccess: requireReadAccess} =
  createAccessFunctions('readKey');

export const {requireAccess: requireWriteAccess} =
  createAccessFunctions('writeKey');
