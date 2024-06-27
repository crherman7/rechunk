import {MoveRight} from 'lucide-react';
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
      <div className="flex p-12 w-[400px] md:w-[500px]">
        <p className="text-md md:text-2xl font-thin italic">
          — Securely render remotely hosted chunks in your React Native
          application.
        </p>
      </div>
      <div className="flex-1 flex justify-center items-center flex-col">
        <h1 className="font-pixelify rechunk-font-size">ReChunk</h1>
        <a href="/" className="px-6 rounded-full border-2 border-black">
          <MoveRight className="h-6 md:h-16 w-6 md:w-16" strokeWidth={1} />
        </a>
      </div>
    </div>
  );
}
