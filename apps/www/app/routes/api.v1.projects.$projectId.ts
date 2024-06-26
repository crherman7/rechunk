// app/routes/api/v1/projects/$projectId.ts
import type {LoaderFunction, ActionFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {requireAuth} from '~/utils/auth';
import {handleError} from '~/utils/error';
import {getProjectById, createProject} from '~/models/project.server';

export const loader: LoaderFunction = async ({params, request}) => {
  try {
    await requireAuth(request);
    const {projectId} = params;
    if (!projectId) {
      return json({error: 'projectId is required'}, {status: 400});
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return json({error: 'Project not found'}, {status: 404});
    }

    return json(project);
  } catch (error) {
    return handleError(error);
  }
};

export const action: ActionFunction = async ({params, request}) => {
  try {
    await requireAuth(request);
    const {projectId} = params;
    if (!projectId) {
      return json({error: 'projectId is required'}, {status: 400});
    }

    // Assuming the project data is sent in the request body
    const newProject = await createProject(projectId);

    return json(newProject, {status: 200});
  } catch (error) {
    return handleError(error);
  }
};
