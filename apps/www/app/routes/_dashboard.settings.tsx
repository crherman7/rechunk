import {json, LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {motion} from 'framer-motion';

import {LabeledInput} from '~/components/LabeledInput';
import {LabeledTextarea} from '~/components/LabeledTextArea';
import {Separator} from '~/components/ui/separator';
import {getProjectById} from '~/models/project.server';
import {requireProjectId} from '~/session.server';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const projectId = await requireProjectId(request);
  const project = await getProjectById(projectId);

  return json({
    project: {
      ...project,
      createdAtFormatted: project?.createdAt
        ? new Date(project.createdAt).toLocaleString()
        : '',
      updatedAtFormatted: project?.updatedAt
        ? new Date(project.updatedAt).toLocaleString()
        : '',
    },
  });
};
export default function Settings() {
  const {project} = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 1}}
      className="space-y-6 overflow-x-auto p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account settings.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Project</h3>
        <LabeledInput label="Identifier" value={project.id} />
        <LabeledInput label="Created At" value={project.createdAtFormatted} />
        <LabeledInput label="Updated At" value={project.updatedAtFormatted} />
      </div>
      <Separator className="my-6" />
      <div className="space-y-4 pr-4">
        <h3 className="text-xl font-bold tracking-tight">
          Authentication Keys
        </h3>
        <LabeledInput label="Read Key" value={project.readKey} />
        <LabeledInput label="Write Key" value={project.writeKey} />
      </div>
      <Separator className="my-6" />
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Cryptographic Keys</h3>
        <LabeledTextarea label="Public Key" value={project.publicKey} />
        <LabeledTextarea label="Private Key" value={project.privateKey} />
      </div>
    </motion.div>
  );
}
