// app/routes/api/v1/projects/$projectId/chunks/$chunkId.ts
import type {LoaderFunction, ActionFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {requireAuth} from '~/utils/auth';
import {handleError} from '~/utils/error';
import {
  getChunkById,
  createOrUpdateChunk,
  deleteChunkById,
} from '~/models/chunk.server';

export const loader: LoaderFunction = async ({params, request}) => {
  try {
    await requireAuth(request);
    const {projectId, chunkId} = params;
    if (!projectId || !chunkId) {
      return json({error: 'projectId and chunkId are required'}, {status: 400});
    }

    const chunk = await getChunkById(projectId, chunkId);
    if (!chunk) {
      return json({error: 'Project or chunk not found'}, {status: 404});
    }

    return json(chunk);
  } catch (error) {
    return handleError(error);
  }
};

export const action: ActionFunction = async ({params, request}) => {
  try {
    await requireAuth(request);
    const {projectId, chunkId} = params;
    if (!projectId || !chunkId) {
      return json({error: 'projectId and chunkId are required'}, {status: 400});
    }

    const method = request.method.toUpperCase();

    if (method === 'POST') {
      const formData = await request.json();
      const data = formData.data;
      if (typeof data !== 'string') {
        return json({error: 'Invalid data format'}, {status: 400});
      }

      const updatedChunk = await createOrUpdateChunk(projectId, chunkId, data);
      return json(
        {message: 'Successfully updated the chunk.', chunk: updatedChunk},
        {status: 200},
      );
    } else if (method === 'DELETE') {
      await deleteChunkById(projectId, chunkId);
      return json({message: 'Successfully deleted the chunk.'}, {status: 200});
    } else {
      return json({error: 'Method not allowed'}, {status: 405});
    }
  } catch (error) {
    return handleError(error);
  }
};
