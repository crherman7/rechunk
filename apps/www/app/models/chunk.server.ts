import type {Chunk} from '@prisma/client';

import {prisma} from '~/db.server';

/**
 * Creates or updates a chunk associated with a project.
 *
 * @param {string} projectId - The ID of the associated project.
 * @param {string} chunkId - The ID of the chunk (optional, use to update existing).
 * @param {Chunk['data']} data - Data for the chunk.
 * @returns {Promise<Chunk>} A promise that resolves to the created or updated chunk.
 */
export async function createOrUpdateChunk(
  projectId: string,
  chunkId: string,
  data: Chunk['data'],
): Promise<Chunk> {
  return prisma.chunk.upsert({
    where: {id: chunkId, projectId},
    create: {
      id: chunkId,
      projectId,
      data,
    },
    update: {data},
  });
}

/**
 * Deletes a chunk by its ID and associated project ID.
 *
 * @param {string} projectId - The ID of the associated project.
 * @param {string} chunkId - The ID of the chunk to delete.
 * @returns {Promise<void>} A promise that resolves when the chunk is deleted.
 */
export async function deleteChunkById(
  projectId: string,
  chunkId: string,
): Promise<void> {
  await prisma.chunk.deleteMany({
    where: {
      id: chunkId,
      projectId,
    },
  });
}

/**
 * Retrieves all chunks for a given project ID.
 *
 * @param {string} projectId - The ID of the project to retrieve chunks for.
 * @returns {Promise<Chunk[]>} A promise that resolves with an array of chunks.
 */
export async function getChunksByProjectId(
  projectId: string,
): Promise<Chunk[]> {
  return prisma.chunk.findMany({
    where: {projectId},
  });
}

/**
 * Retrieves a single chunk by its ID and project ID.
 *
 * @param {string} projectId - The ID of the associated project.
 * @param {string} chunkId - The ID of the chunk to retrieve.
 * @returns {Promise<Chunk | null>} A promise that resolves with the chunk if found, or null if not found.
 */
export async function getChunkById(
  projectId: string,
  chunkId: string,
): Promise<Chunk | null> {
  return prisma.chunk.findFirst({
    where: {
      id: chunkId,
      projectId,
    },
  });
}
