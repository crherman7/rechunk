import {CommitIcon} from '@radix-ui/react-icons';
import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import {animate, motion} from 'framer-motion';
import {useEffect} from 'react';

import {Header} from '~/components/Header';
import {GridPattern} from '~/components/ui/grid-pattern';
import {Muted} from '~/components/ui/text';
import {verifyProjectToken} from '~/models/token.server';
import {createProjectIdSession} from '~/session.server';

export const meta: MetaFunction = () => {
  return [
    {title: 'Rechunk | Token'},
    {
      name: 'description',
      content:
        'Log in to access your personalized dashboard and manage your data efficiently.',
    },
  ];
};

/**
 * Loader function to verify a project token and create a session.
 */
export const loader = async ({request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const projectId = url.searchParams.get('projectId');

  if (!token || !projectId) {
    console.error('Missing token or projectId in search params');
    return redirect('/');
  }

  const verifiedToken = await verifyProjectToken(projectId, token);
  if (!verifiedToken) {
    console.error('Invalid or expired token');
    return redirect('/');
  }

  return createProjectIdSession({
    remember: false,
    request,
    projectId,
    redirectTo: '/chunks',
  });
};

export default function Token() {
  return (
    <div className="flex h-screen flex-col justify-between">
      <motion.div
        animate={{opacity: [0.1, 1, 0.1]}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}>
        <GridPattern className="-z-10 [mask-image:radial-gradient(750px_circle_at_center,white,transparent)]" />
      </motion.div>
      <Header />
      <div className="animate-opacity flex justify-center opacity-0">
        <div className="flex h-screen items-center justify-center">
          <motion.div
            animate={{rotate: 360}}
            transition={{repeat: Infinity, duration: 1, ease: 'linear'}}>
            <CommitIcon className="opacity-75" />
          </motion.div>
        </div>
      </div>
      <footer className="sticky mb-5 w-full text-center">
        <Muted className="opacity-70">© All rights reserved.</Muted>
      </footer>
    </div>
  );
}
