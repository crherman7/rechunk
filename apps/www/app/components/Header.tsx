import {DiscordLogoIcon, ExitIcon, GitHubLogoIcon} from '@radix-ui/react-icons';
import {Form} from '@remix-run/react';

import {useProjectId} from '~/utils/data';

import {Button} from './ui/button';
import * as Text from './ui/text';

type HeaderProps = {
  disableIcon?: boolean;
};

export function Header({disableIcon = false}: HeaderProps) {
  const projectId = useProjectId();

  return (
    <header className="sticky top-0 z-10 flex h-[57px] flex-row items-center justify-between border-b pr-4 backdrop-blur-[10px]">
      <div className="flex flex-row items-center justify-center">
        {disableIcon ? (
          <></>
        ) : (
          <div className="h-[57px] w-[56px] border-r p-2">
            <a href="/">
              <Button variant="outline" size="icon" aria-label="Home">
                <img className="p-[6px]" src="/logo.svg" alt="" />
              </Button>
            </a>
          </div>
        )}

        <h1 className="ml-4 font-pixelify text-2xl">ReChunk</h1>
      </div>
      <div className="flex flex-row items-center">
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
        {!!projectId && (
          <Form method="post" action="/auth/logout">
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="rounded-lg hover:bg-muted"
              aria-label="Settings">
              <ExitIcon className="size-5" />
            </Button>
          </Form>
        )}
        <div className="mx-2 h-4 border-[0.2px]" />
        <a
          href="https://crherman7.github.io/rechunk/"
          className="flex items-center pl-2">
          <Text.Small className="text-center">Docs</Text.Small>
        </a>
      </div>
    </header>
  );
}
