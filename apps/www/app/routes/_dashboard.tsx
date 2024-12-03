import {GearIcon, LayersIcon} from '@radix-ui/react-icons';
import {json, LoaderFunctionArgs} from '@remix-run/node';
import {Outlet} from '@remix-run/react';

import {Header} from '~/components/Header';
import {Button} from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import {requireProjectId} from '~/session.server';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const projectId = await requireProjectId(request);

  return json({projectId});
};

export default function Dashboard() {
  return (
    <div className="grid h-screen grid-cols-1">
      <aside className="inset-y fixed z-20 flex h-full w-[56px] flex-col border-r bg-white">
        <div className="h-[57px] border-b p-2">
          <a href="/">
            <Button variant="outline" size="icon" aria-label="Home">
              <img className="p-[6px]" src="/favicon.png" alt="" />
            </Button>
          </a>
        </div>
        <nav className="grid gap-1 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="/chunks">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg hover:bg-muted"
                    aria-label="Chunks">
                    <LayersIcon className="size-4" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Chunks
              </TooltipContent>
            </Tooltip>
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <a href="/editor">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg hover:bg-muted"
                    aria-label="Editor">
                    <Pencil1Icon className="size-4" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Editor
              </TooltipContent>
            </Tooltip> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="/settings">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg hover:bg-muted"
                    aria-label="Settings">
                    <GearIcon className="size-4" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="ml-[56px] grid grid-rows-[56px_auto]">
        <Header disableIcon />
        <Outlet />
      </div>
    </div>
  );
}
