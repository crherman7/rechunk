import {ArrowRightIcon} from '@radix-ui/react-icons';
import {useNavigate} from '@remix-run/react';

import {Button, ButtonProps} from '~/components/ui/button';
import {Tooltip, TooltipContent, TooltipTrigger} from '~/components/ui/tooltip';
import {cn} from '~/lib/utils';

/**
 * Props for the `GoToNextChunk` component.
 */
export interface GoToNextChunkProps extends Partial<ButtonProps> {
  /**
   * The ID of the current chunk.
   * Used to determine the next chunk in the sequence.
   */
  currentChunkId: string;

  /**
   * An array of chunk IDs that define the navigation sequence.
   */
  chunkIds: string[];

  /**
   * Optional callback invoked after the "Next" button is clicked.
   */
  onNavigateNext?: (nextChunkId: string) => void;
}

/**
 * A button component for navigating to the next chunk in a sequence with accessibility standards.
 *
 * @param props - The props for the `GoToNextChunk` component.
 * @example
 * ```tsx
 * <GoToNextChunk
 *   currentChunkId="chunk1"
 *   chunkIds={['chunk1', 'chunk2', 'chunk3']}
 *   className="custom-class"
 *   onNavigateNext={(nextId) => console.log('Navigated to', nextId)}
 * />
 * ```
 */
export function GoToNextChunk({
  currentChunkId,
  chunkIds,
  onNavigateNext,
  className,
  ...buttonProps
}: GoToNextChunkProps) {
  const navigate = useNavigate();

  const onNext = () => {
    if (!chunkIds || !currentChunkId) return;

    const currentIndex = chunkIds.findIndex(id => id === currentChunkId);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % chunkIds.length;
    const nextChunkId = chunkIds[nextIndex];
    navigate(`/chunks/${nextChunkId}`);
    onNavigateNext?.(nextChunkId);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onNext}
          variant="ghost"
          size="icon"
          className={cn('rounded-lg hover:bg-muted', className)}
          aria-label={`Go to the next chunk after ${currentChunkId}`}
          aria-live="polite"
          {...buttonProps}>
          <ArrowRightIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={5} aria-live="polite">
        Navigate to the next chunk
      </TooltipContent>
    </Tooltip>
  );
}
