import type {Project} from '@prisma/client';
import crypto from 'crypto';

import {prisma} from '~/db.server';

/**
 * Creates a new project, optionally with a given id.
 *
 * @returns {Promise<Project>} A promise that resolves to the created project.
 */
export async function createProject(): Promise<Project> {
  const keys = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  const publicKey = keys.publicKey.export({
    type: 'spki',
    format: 'pem',
  }) as string;
  const privateKey = keys.privateKey.export({
    type: 'pkcs8',
    format: 'pem',
  }) as string;

  return prisma.project.create({
    data: {
      readKey: `read-${crypto.randomUUID()}`,
      writeKey: `write-${crypto.randomUUID()}`,
      privateKey,
      publicKey,
    },
  });
}

/**
 * Retrieves a project by its ID.
 *
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<Project | null>} A promise that resolves with the project if found, or null if not found.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({
    where: {id},
  });
}

/**
 * Verifies the provided project credentials and returns the project ID if valid.
 *
 * @param id - The unique identifier of the project to verify.
 * @param writeKey - The write key associated with the project for authentication.
 * @returns The project ID if the credentials are valid, or `null` if invalid.
 *
 * @example
 * ```typescript
 * const projectId = await getVerifiedProjectId('project-id', 'write-key');
 * if (projectId) {
 *   console.log('Authentication successful:', projectId);
 * } else {
 *   console.log('Invalid project credentials');
 * }
 * ```
 */
export async function getVerifiedProjectId(
  id: string,
  writeKey: string,
): Promise<string | null> {
  const project = await prisma.project.findUnique({where: {id}});

  if (!project) {
    return null;
  }

  return project.writeKey === writeKey ? project.id : null;
}
