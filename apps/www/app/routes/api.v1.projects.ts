import type {ActionFunction} from '@remix-run/node';
import {json} from '@remix-run/node';

import {createProject} from '~/models/project.server';
import {requireBasicAuth} from '~/utils/auth';
import {handleError} from '~/utils/error';

export const action: ActionFunction = async ({request}) => {
  try {
    await requireBasicAuth(request);

    // Assuming the project data is sent in the request body
    const {id, readKey, writeKey, publicKey, privateKey} =
      await createProject();

    return json(
      {
        $schema: 'https://crherman7.github.io/rechunk/schema.json',
        project: id,
        readKey,
        writeKey,
        publicKey,
        privateKey,
        entry: {},
        external: [],
      },
      {status: 200},
    );
  } catch (error) {
    return handleError(error);
  }
};
