import {json, LoaderFunctionArgs, MetaFunction} from '@remix-run/node';
import {Outlet, useLoaderData, useLocation, useParams} from '@remix-run/react';
import {motion} from 'framer-motion';
import {Fragment} from 'react/jsx-runtime';

import {ChunkItem} from '~/components/ChunkItem';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';
import {ScrollArea} from '~/components/ui/scroll-area';
import {Separator} from '~/components/ui/separator';
import {getChunksByProjectId} from '~/models/chunk.server';
import {requireProjectId} from '~/session.server';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const projectId = await requireProjectId(request);
  const chunks = await getChunksByProjectId(projectId);

  return json({
    projectId,
    chunks: chunks.map(it => ({
      ...it,
      filePath: Buffer.from(it.id, 'base64').toString('utf-8'),
    })),
  });
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Rechunk | Project ${data?.projectId}`},
    {
      name: 'description',
      content:
        'Explore and manage your data chunks effortlessly with our intuitive interface.',
    },
  ];
};

export default function Chunks() {
  const {chunkId} = useParams();
  const {pathname} = useLocation();
  const {projectId, chunks} = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 1}}>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={30} minSize={30} maxSize={70}>
          <div className="flex h-[75px] flex-col justify-end space-y-0.5 border-b px-3 pb-1">
            <h2 className="text-2xl font-bold tracking-tight">Chunks</h2>
            <p className="text-xs text-muted-foreground">
              Project <span className="font-mono text-xs">{projectId}</span>
            </p>
          </div>
          <ScrollArea className="h-[calc(100vh-132px)]">
            {!chunks.length && (
              <p className="text text-muted-foreground">No chunks published</p>
            )}
            {!!chunks.length &&
              chunks.map((it, index) => (
                <Fragment key={it.id}>
                  <ChunkItem
                    key={it.id}
                    id={it.id}
                    filePath={it.filePath}
                    data={it.data}
                    createdAt={it.createdAt}
                    updatedAt={it.updatedAt}
                    isSelected={chunkId === it.id}
                  />
                  {chunks.length - 1 !== index && <Separator />}
                </Fragment>
              ))}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle={pathname !== '/chunks'} />
        <Outlet />
      </ResizablePanelGroup>
    </motion.div>
  );
}
