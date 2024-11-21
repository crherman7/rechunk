import {Form} from '@remix-run/react';
import {Button} from './ui/button';
import * as Text from './ui/text';
import {DiscordLogoIcon, GitHubLogoIcon, ExitIcon} from '@radix-ui/react-icons';
import {useProjectId} from '~/utils/data';

type HeaderProps = {
  disableIcon?: boolean;
};

export function Header({disableIcon = false}: HeaderProps) {
  const projectId = useProjectId();

  return (
    <header className="border-b h-[57px] sticky top-0 flex flex-row items-center justify-between pr-4 backdrop-blur-[2px]">
      <div className="flex flex-row justify-center items-center">
        {disableIcon ? (
          <></>
        ) : (
          <div className="border-r p-2 h-[57px] w-[56px]">
            <a href="/">
              <Button variant="outline" size="icon" aria-label="Home">
                <img className="p-[6px]" src="/logo.svg" alt="" />
              </Button>
            </a>
          </div>
        )}

        <h1 className="ml-4 text-2xl font-pixelify">ReChunk</h1>
      </div>
      <div className="flex-row flex items-center">
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
        <div className="h-4 border-[0.2px] mx-2" />
        <a
          href="https://crherman7.github.io/rechunk/"
          className="pl-2 flex items-center">
          <Text.Small className="text-center">Docs</Text.Small>
        </a>
      </div>
    </header>
  );
}
