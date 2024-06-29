import {Github, MessageSquare, MoveRight} from 'lucide-react';
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
          <p className="text-md md:text-2xl font-thin italic">
            — Securely render remotely hosted chunks in your React Native
            application.
          </p>
        </div>
        <div className="flex flex-row mt-2 gap-4">
          <a href="https://github.com/crherman7/rechunk">
            <Github className="h-4 w-4 md:h-6 md:w-6" strokeWidth={1.5} />
          </a>
          <a href="https://discord.gg/xFhuxjwhss">
            <MessageSquare
              className="h-4 w-4 md:h-6 md:w-6"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center flex-col">
        <h1 className="font-pixelify rechunk-font-size">ReChunk</h1>
        <a
          href="/"
          className="px-6 rounded-full border-2 border-black group hover:bg-black">
          <MoveRight
            className="h-6 md:h-16 w-6 md:w-16 group-hover:text-white group-hover:bg-black"
            strokeWidth={1}
          />
        </a>
      </div>
      <div className="w-full text-center mb-5">
        <p className="text-xs font-light opacity-70">© All rights reserved.</p>
      </div>
    </div>
  );
}
