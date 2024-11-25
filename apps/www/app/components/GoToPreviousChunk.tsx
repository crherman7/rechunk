import {ArrowLeftIcon} from '@radix-ui/react-icons';
import {useNavigate} from '@remix-run/react';

import {Button, ButtonProps} from '~/components/ui/button';
import {Tooltip, TooltipContent, TooltipTrigger} from '~/components/ui/tooltip';
import {cn} from '~/lib/utils';

/**
 * Props for the `GoToPreviousChunk` component.
 */
export interface GoToPreviousChunkProps extends Partial<ButtonProps> {
  /**
   * The ID of the current chunk.
   * Used to determine the previous chunk in the sequence.
   */
  currentChunkId: string;

  /**
   * An array of chunk IDs that define the navigation sequence.
   */
  chunkIds: string[];

  /**
   * Optional callback invoked after the "Previous" button is clicked.
   */
  onNavigatePrevious?: (previousChunkId: string) => void;
}

/**
 * A button component for navigating to the previous chunk in a sequence with accessibility standards.
 *
 * @param props - The props for the `GoToPreviousChunk` component.
 * @example
 * ```tsx
 * <GoToPreviousChunk
 *   currentChunkId="chunk2"
 *   chunkIds={['chunk1', 'chunk2', 'chunk3']}
 *   className="custom-class"
 *   onNavigatePrevious={(prevId) => console.log('Navigated to', prevId)}
 * />
 * ```
 */
export function GoToPreviousChunk({
  currentChunkId,
  chunkIds,
  onNavigatePrevious,
  className,
  ...buttonProps
}: GoToPreviousChunkProps) {
  const navigate = useNavigate();

  const onPrevious = () => {
    if (!chunkIds || !currentChunkId) return;

    const currentIndex = chunkIds.findIndex(id => id === currentChunkId);
    if (currentIndex === -1) return;

    const previousIndex =
      (currentIndex - 1 + chunkIds.length) % chunkIds.length;
    const previousChunkId = chunkIds[previousIndex];
    navigate(`/chunks/${previousChunkId}`);
    onNavigatePrevious?.(previousChunkId);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onPrevious}
          variant="ghost"
          size="icon"
          className={cn('rounded-lg hover:bg-muted', className)}
          aria-label={`Go to the previous chunk before ${currentChunkId}`}
          aria-live="polite"
          {...buttonProps}>
          <ArrowLeftIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={5} aria-live="polite">
        Navigate to the previous chunk
      </TooltipContent>
    </Tooltip>
  );
}
