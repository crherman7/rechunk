import {useMatches} from '@remix-run/react';

type DocType = {title: string};

export function useDoc(): DocType | null {
  const data = useMatches().slice(-1)[0].data;
  if (!data || !(typeof data === 'object')) return null;

  return data as DocType;
}
