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
