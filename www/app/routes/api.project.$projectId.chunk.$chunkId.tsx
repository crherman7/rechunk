import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
} from '@remix-run/node';

export const loader: LoaderFunction = ({
  request,
  params,
}: LoaderFunctionArgs) => {
  return [];
};

export const action: ActionFunction = ({
  request,
  params,
}: ActionFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      /* handle "POST" */
      break;
    }
    case 'DELETE': {
      /* handle "DELETE" */
      break;
    }
  }

  return null;
};
