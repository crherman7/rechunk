import {prisma} from '~/db.server';
import {generateToken, verifyToken} from '~/utils/auth';

/**
 * Creates a new project token and stores it in the database.
 *
 * @param projectId - The ID of the project for which the token is created.
 * @param secret - The secret key used for signing the token.
 * @param expiresInSeconds - The token's lifespan in seconds (default: 1 hour).
 * @returns The created token string.
 */
export async function createProjectToken(
  projectId: string,
  secret: string = '',
  expiresInSeconds: number = 3600,
) {
  const token = generateToken(secret, expiresInSeconds);

  return await prisma.token.create({
    data: {
      token,
      project: {
        connect: {id: projectId},
      },
    },
  });
}

/**
 * Verifies a project token by checking its validity and existence in the database.
 *
 * @param projectId - The ID of the project associated with the token.
 * @param token - The token string to verify.
 * @param secret - The secret key used for verification.
 * @returns The decoded payload if the token is valid, or `null` if invalid.
 */
export async function verifyProjectToken(
  projectId: string,
  token: string,
  secret: string = '',
) {
  try {
    // Verify the token signature and expiration
    const payload = verifyToken(token, secret);

    // Check if the token exists in the database
    const tokenFound = await prisma.token.findFirst({
      where: {projectId, token},
    });

    if (!tokenFound) {
      return null;
    }

    await prisma.token.delete({where: {id: tokenFound.id}});

    return payload;
  } catch (error) {
    // Return null if verification fails
    return null;
  }
}
