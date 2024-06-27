import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {title: 'ReChunk'},
    {name: 'description', content: 'Welcome to ReChunk!'},
  ];
};

export default function Index() {
  return (
    <div className="h-dvh w-dvw justify-center items-center flex">
      <div className="absolute flex h-dvh w-dvw rechunk-background -z-10"></div>
      <div>
        <h1 className="font-pixelify rechunk-font-size animate-in slide-in-from-bottom-full duration-1000">
          ReChunk
        </h1>
      </div>
    </div>
  );
}
