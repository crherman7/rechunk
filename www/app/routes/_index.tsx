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
      <h1 className="text-9xl font-pixelify h">ReChunk</h1>
    </div>
  );
}
