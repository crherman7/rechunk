import type {Chunk} from '@prisma/client';

export async function createChunk({
  name,
  data,
  projectId,
}: Pick<Chunk, 'name' | 'data' | 'projectId'>) {}

export async function deleteChunkById(id: Chunk['id']) {}

export async function deleteChunkByName({
  name,
  projectId,
}: Pick<Chunk, 'name' | 'projectId'>) {}

export async function getChunks(projectId: Chunk['projectId']) {}

export async function getChunkById(id: Chunk['id']) {}

export async function getChunkByName({
  name,
  projectId,
}: Pick<Chunk, 'name' | 'projectId'>) {}

export async function updateChunkById(id: Chunk['id']) {}

export async function updateChunkByName({
  name,
  projectId,
}: Pick<Chunk, 'name' | 'projectId'>) {}
