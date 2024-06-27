import {MoveRight} from 'lucide-react';
import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {title: 'ReChunk'},
    {name: 'description', content: 'Welcome to ReChunk!'},
  ];
};

export default function Index() {
  return (
    <div className="h-dvh w-dvw justify-center items-center flex flex-col gap-6">
      <div className="absolute flex h-dvh w-dvw rechunk-background -z-10"></div>
      <h1 className="font-pixelify rechunk-font-size">ReChunk</h1>
      <a href="/" className="px-6 rounded-full border-2 border-black">
        <MoveRight className="h-6 md:h-16 w-6 md:w-16" strokeWidth={1} />
      </a>
    </div>
  );
}
