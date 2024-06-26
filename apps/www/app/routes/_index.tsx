import {
  CaretRightIcon,
  GitHubLogoIcon,
  DiscordLogoIcon,
  ExternalLinkIcon,
} from '@radix-ui/react-icons';
import type {MetaFunction} from '@remix-run/node';

import * as Text from '~/components/ui/text';
import {Button} from '~/components/ui/button';
import {Link} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'ReChunk | Remote Chunks'},
    {name: 'description', content: 'Welcome to ReChunk!'},
  ];
};

export default function Index() {
  return (
    <div className="h-dvh w-dvw flex flex-col">
      <div className="fixed inset-0 object-cover object-center bg-gradient-to-t from-white from-10% -z-20 opacity-70"></div>
      <div className="absolute inset-0 -z-30 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <header className="border-b h-[57px] sticky top-0 flex flex-row items-center justify-between pr-4 backdrop-blur-[2px]">
        <div className="flex flex-row justify-center items-center">
          <div className="border-r p-2 h-[57px] w-[56px]">
            <a href="/">
              <Button variant="outline" size="icon" aria-label="Home">
                <img className="p-[6px]" src="/logo.svg" alt="" />
              </Button>
            </a>
          </div>
          <h1 className="ml-4 text-2xl font-pixelify">ReChunk</h1>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        <div className="flex flex-col justify-center items-start p-10 gap-8">
          <div>
            <h1 className="text-foreground text-5xl md:text-7xl font-bold">
              Developer Focused Server-Driven Experiences
            </h1>
            <Text.P className="font-thin leading-normal text-xs md:text-sm">
              Securely render externally hosted components in React Native.
              Developer or creator this tool is for you, remotely host
              components or whole screen experiences.
            </Text.P>
          </div>
          <div className="flex flex-row gap-4">
            <Link to="/chunks">
              <Button>
                <Text.P>Get Started</Text.P>
                <CaretRightIcon className="size-5" />
              </Button>
            </Link>
            <Link to="https://crherman7.github.io/rechunk/">
              <Button>
                <Text.P>Docs</Text.P>
                <ExternalLinkIcon className="size-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="fixed mt-12 mr-10 flex flex-col items-end">
            <div className="bg-green-500 px-2">
              <p className="text-[8px] text-white">chunk_001</p>
            </div>
            <img
              src="/feed.png"
              className="h-[250px] object-contain border-[1px] border-green-500 ml-6"
              alt="feed"
            />
          </div>
          <img
            src="/arrow_11.svg"
            className="size-20 rotate-[270deg] fixed mt-[340px] ml-28"
            alt="arrow"
          />
          <img
            src="/arrow_26.svg"
            className="size-24 rotate-[90deg] fixed mt-[120px] ml-64"
            alt="arrow"
          />
          <img
            src="/iphone.png"
            alt="iphone"
            className="size-[700px] object-contain fixed mt-60 ml-24"
          />
          <p className="font-marker fixed text-xl w-44 mt-56 ml-36 rotate-[310deg]">
            dynamic on-demand bundles!
          </p>
        </div>
      </div>
      <footer className="bottom-0 sticky w-full text-center py-4">
        <Text.Muted className="opacity-70">© All rights reserved.</Text.Muted>
      </footer>
    </div>
  );
}
