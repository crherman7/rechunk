import type {ActionFunction, LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import crypto from 'crypto';
import {KEYUTIL, KJUR, RSAKey} from 'jsrsasign';

import {
  createOrUpdateChunk,
  deleteChunkById,
  getChunkById,
} from '~/models/chunk.server';
import {getProjectById} from '~/models/project.server';
import {requireReadAccess, requireWriteAccess} from '~/utils/auth';
import {handleError} from '~/utils/error';

/**
 * Generates a signed token for the chunk using the private key.
 *
 * @param code - The bundled code for which to generate the token.
 * @param privateKey - The private key to sign the token.
 * @returns The signed token.
 */
function generateToken(code: string, privateKey: string): string {
  const prvKey = KEYUTIL.getKey(privateKey) as RSAKey;
  const sPayload = crypto.createHash('sha256').update(code).digest('hex');

  return KJUR.jws.JWS.sign(
    'RS256',
    JSON.stringify({alg: 'RS256'}),
    sPayload,
    prvKey,
  );
}

export const loader: LoaderFunction = async ({params, request}) => {
  try {
    await requireReadAccess(request);

    const {projectId, chunkId} = params;
    if (!projectId || !chunkId) {
      return json({error: 'projectId and chunkId are required'}, {status: 400});
    }

    const chunk = await getChunkById(projectId, chunkId);
    const project = await getProjectById(projectId);
    if (!chunk || !project) {
      return json({error: 'Project or chunk not found'}, {status: 404});
    }

    return json(
      {
        data: chunk.data,
        token: generateToken(chunk.data, project.privateKey),
      },
      {status: 200},
    );
  } catch (error) {
    return handleError(error);
  }
};

export const action: ActionFunction = async ({params, request}) => {
  try {
    await requireWriteAccess(request);
    const {projectId, chunkId} = params;
    if (!projectId || !chunkId) {
      return json({error: 'projectId and chunkId are required'}, {status: 400});
    }

    const method = request.method.toUpperCase();

    if (method === 'POST') {
      const data = await request.json();
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
