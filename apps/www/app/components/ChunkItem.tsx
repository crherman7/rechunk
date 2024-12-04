import {Link} from '@remix-run/react';
import {format} from 'date-fns';
import {formatDistanceToNow} from 'date-fns/formatDistanceToNow';

import {DATE_FORMAT} from '~/lib/constants';
import {cn} from '~/lib/utils';

export interface ChunkItemProps {
  /**
   * The ID of the chunk.
   */
  id: string;

  /**
   * The project ID associated with the chunk.
   */
  projectId: string;

  /**
   * The data stored within the chunk.
   */
  data: string;

  /**
   * The creation date of the chunk.
   */
  createdAt: string;

  /**
   * The last updated date of the chunk.
   */
  updatedAt: string;

  /**
   * The ID of the currently selected chunk (used for highlighting).
   */
  isSelected?: boolean;
}

/**
 * Renders an individual chunk item as a link.
 *
 * @param props - The props for the `ChunkItem` component.
 * @example
 * ```tsx
 * <ChunkItem
 *   id="chunk123"
 *   projectId="project456"
 *   data="Example data"
 *   createdAt="2024-01-01T00:00:00.000Z"
 *   updatedAt="2024-01-02T00:00:00.000Z"
 *   isSelected={true}
 * />
 * ```
 */
export function ChunkItem({
  id,
  projectId,
  data,
  createdAt,
  updatedAt,
  isSelected = false,
}: ChunkItemProps) {
  return (
    <Link
      to={`/chunks/${id}`}
      key={id}
      className={cn(
        'my-3 flex max-w-[600px] flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
        isSelected && 'bg-accent',
      )}>
      <div className="mb-2 flex w-full flex-row items-center justify-between">
        <p className="text-sm font-bold">{id}</p>
        <p className="text-xs font-normal">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        {format(new Date(updatedAt), DATE_FORMAT)}
      </p>
      <p className="font-mono text-xs font-medium text-slate-400">
        {projectId}
      </p>
      <div className="rounded-lg bg-slate-50 p-2">
        <p className="line-clamp-3 text-wrap break-all font-mono text-[10px] font-extralight text-slate-400">
          {data}
        </p>
      </div>
    </Link>
  );
}
