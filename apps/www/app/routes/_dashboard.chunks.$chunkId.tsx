import {ActionFunction, MetaFunction, redirect} from '@remix-run/node';
import {useParams} from '@remix-run/react';
import {format} from 'date-fns/format';

import {GoToNextChunk} from '~/components/GoToNextChunk';
import {GoToPreviousChunk} from '~/components/GoToPreviousChunk';
import {LabeledInput} from '~/components/LabeledInput';
import {LabeledTextarea} from '~/components/LabeledTextArea';
import {MoveToTrash} from '~/components/MoveToTrash';
import {ResizablePanel} from '~/components/ui/resizable';
import {ScrollArea} from '~/components/ui/scroll-area';
import {Separator} from '~/components/ui/separator';
import {TooltipProvider} from '~/components/ui/tooltip';
import {DATE_FORMAT} from '~/lib/constants';
import {deleteChunkById} from '~/models/chunk.server';
import {requireProjectId} from '~/session.server';
import {useChunk, useChunkIds} from '~/utils/data';

export const meta: MetaFunction = ({params}) => {
  return [
    {title: `Rechunk | Chunk ${params?.chunkId}`},
    {
      name: 'description',
      content:
        'Retrieve detailed information about a specific chunk within a project.',
    },
  ];
};

export const action: ActionFunction = async ({request}) => {
  const projectId = await requireProjectId(request);
  const formData = await request.formData();
  const chunkId = formData.get('chunkId');

  if (!chunkId) return;

  const method = request.method.toUpperCase();

  if (method === 'DELETE') {
    await deleteChunkById(projectId, chunkId.toString());
    return redirect('/chunks');
  }
};

export default function Chunk() {
  const {chunkId} = useParams();
  const chunk = useChunk(chunkId as string);
  const chunkIds = useChunkIds();

  return (
    <TooltipProvider delayDuration={300}>
      <ResizablePanel defaultSize={70} minSize={30} maxSize={70}>
        <div className="flex h-[75px] flex-row items-end justify-between border-b px-4 pb-1">
          <div className="flex flex-col space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Chunk</h2>
            <p className="text-xs text-muted-foreground">
              Identifier <span className="font-mono text-xs">{chunkId}</span>
            </p>
          </div>
          <div className="flex flex-row">
            <MoveToTrash chunkId={chunkId || ''} />
            <div className="flex flex-row items-center gap-2">
              <GoToPreviousChunk
                currentChunkId={chunkId || ''}
                chunkIds={chunkIds || []}
              />
              <GoToNextChunk
                currentChunkId={chunkId || ''}
                chunkIds={chunkIds || []}
              />
            </div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-132px)]">
          <div className="space-y-4 px-4 py-2">
            <h3 className="text-xl font-bold tracking-tight">Metadata</h3>
            <LabeledInput
              label="Created At"
              value={format(new Date(chunk?.createdAt || ''), DATE_FORMAT)}
            />
            <LabeledInput
              label="Updated At"
              value={format(new Date(chunk?.updatedAt || ''), DATE_FORMAT)}
            />
          </div>
          <Separator className="my-2" />
          <div className="space-y-4 px-4">
            <h3 className="text-xl font-bold tracking-tight">Data</h3>
            <LabeledTextarea
              label="JavaScript"
              value={chunk?.data}
              className="bg-slate-50"
            />
          </div>
        </ScrollArea>
      </ResizablePanel>
    </TooltipProvider>
  );
}
