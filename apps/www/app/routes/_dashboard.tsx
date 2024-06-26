import {
  Pencil1Icon,
  TokensIcon,
  GearIcon,
  GitHubLogoIcon,
  DiscordLogoIcon,
} from '@radix-ui/react-icons';
import {Outlet} from '@remix-run/react';

import {Button} from '~/components/ui/button';
import * as Text from '~/components/ui/text';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 h-screen">
      <aside className="inset-y fixed flex h-full flex-col border-r w-[56px]">
        <div className="border-b p-2 h-[57px]">
          <a href="/">
            <Button variant="outline" size="icon" aria-label="Home">
              <img className="p-[6px]" src="/logo.svg" alt="" />
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
                    <TokensIcon className="size-5" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Chunks
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="/editor">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg hover:bg-muted"
                    aria-label="Editor">
                    <Pencil1Icon className="size-5" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Editor
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="/settings">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg hover:bg-muted"
                    aria-label="Settings">
                    <GearIcon className="size-5" />
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
        <header className="border-b h-[57px] sticky top-0 flex flex-row items-center justify-between pr-4">
          <h1 className="ml-4 text-2xl font-pixelify">ReChunk</h1>
          <div className="flex-row flex">
            <a href="https://github.com/crherman7/rechunk">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg hover:bg-muted"
                aria-label="Settings">
                <GitHubLogoIcon className="size-5" />
              </Button>
            </a>
            <a href="https://discord.gg/xFhuxjwhss">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg hover:bg-muted"
                aria-label="Settings">
                <DiscordLogoIcon className="size-5" />
              </Button>
            </a>
            <a
              href="https://crherman7.github.io/rechunk/"
              className="pl-2 flex items-center">
              <Text.Small className="text-center">Docs</Text.Small>
            </a>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
