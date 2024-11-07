import type {ActionFunction} from '@remix-run/node';
import {json} from '@remix-run/node';

import {requireBasicAuth} from '~/utils/auth';
import {handleError} from '~/utils/error';
import {createProject} from '~/models/project.server';

export const action: ActionFunction = async ({request}) => {
  try {
    await requireBasicAuth(request);

    // Assuming the project data is sent in the request body
    const newProject = await createProject();

    return json(newProject, {status: 200});
  } catch (error) {
    return handleError(error);
  }
};
