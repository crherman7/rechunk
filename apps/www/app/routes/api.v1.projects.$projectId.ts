import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';

import {requireReadAccess} from '~/utils/auth';
import {handleError} from '~/utils/error';
import {getProjectById} from '~/models/project.server';

export const loader: LoaderFunction = async ({params, request}) => {
  try {
    await requireReadAccess(request);
    const {projectId} = params;
    if (!projectId) {
      return json({error: 'projectId is required'}, {status: 400});
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return json({error: 'Project not found'}, {status: 404});
    }

    return json(project, {status: 200});
  } catch (error) {
    return handleError(error);
  }
};
