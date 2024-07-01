import {
  CaretRightIcon,
  GitHubLogoIcon,
  DiscordLogoIcon,
} from '@radix-ui/react-icons';
import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {title: 'ReChunk | Remote Chunks'},
    {name: 'description', content: 'Welcome to ReChunk!'},
  ];
};

export default function Index() {
  return (
    <div className="h-dvh w-dvw flex flex-col">
      <div className="absolute flex h-dvh w-dvw rechunk-background -z-10"></div>
      <div className="p-12 flex w-full justify-between items-start">
        <div className="max-w-[400px] md:max-w-[500px] text-wrap pr-12">
          <p className="text-md text-foreground md:text-2xl font-thin italic">
            — Securely render remotely hosted chunks in your React Native
            application.
          </p>
        </div>
        <div className="flex flex-row">
          <a
            href="https://github.com/crherman7/rechunk"
            className="hover:bg-gray-100 p-3 rounded-full">
            <GitHubLogoIcon className="h-4 w-4 md:h-6 md:w-6" />
          </a>
          <a
            href="https://discord.gg/xFhuxjwhss"
            className="hover:bg-gray-100 p-3 rounded-full">
            <DiscordLogoIcon className="h-4 w-4 md:h-6 md:w-6" />
          </a>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center flex-col">
        <h1 className="text-foreground font-pixelify rechunk-font-size">
          ReChunk
        </h1>
        <a
          href="/"
          className="px-6 rounded-full border-2 border-foreground group hover:bg-foreground">
          <CaretRightIcon className="h-6 md:h-10 w-6 md:w-10 group-hover:text-background group-hover:bg-foreground" />
        </a>
      </div>
      <div className="w-full text-center mb-5">
        <p className="text-xs opacity-70 text-muted-foreground">
          © All rights reserved.
        </p>
      </div>
    </div>
  );
}
