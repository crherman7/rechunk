import {useState} from 'react';

import {cn} from '~/lib/utils';

interface BetaWarningProps extends React.HTMLAttributes<HTMLElement> {}

export const BetaWarning = ({className}: BetaWarningProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 z-50 w-full bg-black text-white',
        'flex items-center justify-between px-4 py-3 shadow-lg md:px-6',
        className,
      )}
      role="alert"
      aria-live="assertive">
      <p className="text-[10px]" id="beta-warning-message">
        <strong>ReChunk</strong> is currently in <strong>beta mode</strong>.
        This means the software is still under active development, and while we
        aim to provide a stable and reliable experience, you may encounter{' '}
        <strong>unexpected issues</strong>, <strong>breaking changes</strong>,
        or incomplete features. We do not recommend using this tool in{' '}
        <strong>production environments</strong> until it has reached a stable
        release version. By using this software, you acknowledge that it is
        provided <strong>"as is"</strong> and accept any potential risks
        associated with its use. Your feedback and bug reports are invaluable in
        helping us improve and refine <strong>ReChunk</strong>. If you encounter
        any problems or have suggestions for improvement, please let us know
        through our <strong>official issue tracker</strong> or{' '}
        <strong>community channels</strong>. Thank you for your support and for
        helping make <strong>ReChunk</strong> better!
      </p>
      <button
        onClick={() => setIsDismissed(true)}
        className={cn(
          'ml-4 w-[200px] bg-white px-4 py-2 text-xs font-medium text-black',
          'rounded-md transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
        )}
        aria-label="Dismiss beta warning"
        aria-describedby="beta-warning-message">
        Ok
      </button>
    </div>
  );
};
