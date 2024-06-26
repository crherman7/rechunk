// app/routes/api/v1/projects/$projectId/chunks.ts
import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {requireAuth} from '~/utils/auth';
import {handleError} from '~/utils/error';
import {getChunksByProjectId} from '~/models/chunk.server';

export const loader: LoaderFunction = async ({params, request}) => {
  try {
    await requireAuth(request);
    const {projectId} = params;
    if (!projectId) {
      return json({error: 'projectId is required'}, {status: 400});
    }

    const chunks = await getChunksByProjectId(projectId);
    if (!chunks) {
      return json({error: 'Project not found'}, {status: 404});
    }

    return json(chunks);
  } catch (error) {
    return handleError(error);
  }
};
