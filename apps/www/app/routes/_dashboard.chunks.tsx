import {json, LoaderFunctionArgs} from '@remix-run/node';
import {Outlet, useLoaderData, useParams} from '@remix-run/react';
import {motion} from 'framer-motion';

import {ChunkItem} from '~/components/ChunkItem';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';
import {ScrollArea} from '~/components/ui/scroll-area';
import {getChunksByProjectId} from '~/models/chunk.server';
import {requireProjectId} from '~/session.server';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const projectId = await requireProjectId(request);
  const chunks = await getChunksByProjectId(projectId);

  return json({
    projectId,
    chunks,
  });
};

export default function Chunks() {
  const {projectId, chunks} = useLoaderData<typeof loader>();
  const {chunkId} = useParams();

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 1}}>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={30} minSize={30} maxSize={70}>
          <div className="flex h-[75px] flex-col justify-end space-y-0.5 border-b px-4 pb-1">
            <h2 className="text-2xl font-bold tracking-tight">Chunks</h2>
            <p className="text-xs text-muted-foreground">
              Project <span className="font-mono text-xs">{projectId}</span>
            </p>
          </div>
          <ScrollArea className="h-[calc(100vh-140px)] px-4">
            {!chunks.length && (
              <p className="text text-muted-foreground">No chunks published</p>
            )}
            {chunks.length &&
              chunks.map(it => (
                <ChunkItem
                  key={it.id}
                  id={it.id}
                  projectId={it.projectId}
                  data={it.data}
                  createdAt={it.createdAt}
                  updatedAt={it.updatedAt}
                  isSelected={chunkId === it.id}
                />
              ))}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <Outlet />
      </ResizablePanelGroup>
    </motion.div>
  );
}
