import {TrashIcon} from '@radix-ui/react-icons';
import {Form} from '@remix-run/react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import {Button, ButtonProps} from '~/components/ui/button';
import {cn} from '~/lib/utils';

/**
 * Props for the `MoveToTrashButton` component.
 */
export interface MoveToTrashProps extends Partial<ButtonProps> {
  /**
   * The ID of the chunk to be moved to the trash.
   */
  chunkId: string;

  /**
   * Callback invoked when the trash action is confirmed.
   */
  onConfirmTrash?: (chunkId: string) => void;

  /**
   * Optional text to customize the confirmation dialog.
   */
  confirmationText?: string;
}

/**
 * A button component for moving a chunk to the trash with an alert dialog and accessibility support.
 *
 * @param props - The props for the `MoveToTrashButton` component.
 * @example
 * ```tsx
 * <MoveToTrashButton
 *   chunkId="chunk1"
 *   className="custom-class"
 *   onConfirmTrash={(id) => console.log('Confirmed trash for:', id)}
 *   confirmationText="This action cannot be undone. Are you sure you want to delete this chunk?"
 * />
 * ```
 */
export function MoveToTrash({
  chunkId,
  onConfirmTrash,
  confirmationText = 'This action cannot be undone. This will permanently delete your chunk and remove the data from our servers.',
  className,
  ...buttonProps
}: MoveToTrashProps) {
  const handleConfirmTrash = () => {
    onConfirmTrash?.(chunkId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('rounded-lg hover:bg-red-100', className)}
          aria-label={`Delete chunk ${chunkId}`}
          {...buttonProps}>
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{confirmationText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Form method="delete">
              <button
                type="submit"
                name="chunkId"
                value={chunkId}
                className="rounded-lg px-4 py-2 text-white"
                aria-label={`Confirm delete for chunk ${chunkId}`}
                onClick={handleConfirmTrash}>
                Delete
              </button>
            </Form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
