import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';

import {getChunksByProjectId} from '~/models/chunk.server';
import {requireReadAccess} from '~/utils/auth';
import {handleError} from '~/utils/error';

export const loader: LoaderFunction = async ({params, request}) => {
  try {
    await requireReadAccess(request);
    const {projectId} = params;
    if (!projectId) {
      return json({error: 'projectId is required'}, {status: 400});
    }

    const chunks = await getChunksByProjectId(projectId);
    if (!chunks) {
      return json({error: 'Project not found'}, {status: 404});
    }

    return json(chunks, {status: 200});
  } catch (error) {
    return handleError(error);
  }
};
