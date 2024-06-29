import type {Chunk} from '@prisma/client';

/**
 * Creates a new chunk.
 *
 * @param {Pick<Chunk, 'name' | 'data' | 'projectId'>} chunk - The details of the chunk to create.
 * @returns {Promise<void>} A promise that resolves when the chunk is created.
 */
export async function createChunk({
  name,
  data,
  projectId,
}: Pick<Chunk, 'name' | 'data' | 'projectId'>): Promise<void> {}

/**
 * Deletes a chunk by its ID.
 *
 * @param {Chunk['id']} id - The ID of the chunk to delete.
 * @returns {Promise<void>} A promise that resolves when the chunk is deleted.
 */
export async function deleteChunkById(id: Chunk['id']): Promise<void> {}

/**
 * Deletes a chunk by its name and project ID.
 *
 * @param {Pick<Chunk, 'name' | 'projectId'>} chunk - The name and project ID of the chunk to delete.
 * @returns {Promise<void>} A promise that resolves when the chunk is deleted.
 */
export async function deleteChunkByName({
  name,
  projectId,
}: Pick<Chunk, 'name' | 'projectId'>): Promise<void> {}

/**
 * Retrieves all chunks for a given project ID.
 *
 * @param {Chunk['projectId']} projectId - The ID of the project to retrieve chunks for.
 * @returns {Promise<Chunk[]>} A promise that resolves with an array of chunks.
 */
export async function getChunks(
  projectId: Chunk['projectId'],
): Promise<Chunk[]> {}

/**
 * Retrieves a chunk by its ID.
 *
 * @param {Chunk['id']} id - The ID of the chunk to retrieve.
 * @returns {Promise<Chunk | null>} A promise that resolves with the chunk if found, or null if not found.
 */
export async function getChunkById(id: Chunk['id']): Promise<Chunk | null> {}

/**
 * Retrieves a chunk by its name and project ID.
 *
 * @param {Pick<Chunk, 'name' | 'projectId'>} chunk - The name and project ID of the chunk to retrieve.
 * @returns {Promise<Chunk | null>} A promise that resolves with the chunk if found, or null if not found.
 */
export async function getChunkByName({
  name,
  projectId,
}: Pick<Chunk, 'name' | 'projectId'>): Promise<Chunk | null> {}

/**
 * Updates a chunk by its ID.
 *
 * @param {Chunk['id']} id - The ID of the chunk to update.
 * @returns {Promise<void>} A promise that resolves when the chunk is updated.
 */
export async function updateChunkById(id: Chunk['id']): Promise<void> {}

/**
 * Updates a chunk by its name and project ID.
 *
 * @param {Pick<Chunk, 'name' | 'projectId'>} chunk - The name and project ID of the chunk to update.
 * @returns {Promise<void>} A promise that resolves when the chunk is updated.
 */
export async function updateChunkByName({
  name,
  projectId,
}: Pick<Chunk, 'name' | 'projectId'>): Promise<void> {}
