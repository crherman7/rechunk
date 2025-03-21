import {Outlet} from '@remix-run/react';

import {DocsSidebar} from '~/components/DocsSidebar';
import {Header} from '~/components/Header';
import {GridPattern} from '~/components/ui/grid-pattern';

export default function DocsLayout() {
  return (
    <>
      <Header />
      <GridPattern className="fixed top-3 -z-10 [mask-image:radial-gradient(750px_circle_at_center,white,transparent)] lg:-top-1" />
      <div className="m-auto block px-4 sm:px-6 lg:flex lg:px-11 xl:w-[95rem]">
        <DocsSidebar />
        <div className="markdown pb-[33vh]min-h-[80vh] w-full lg:ml-3 lg:w-[calc(100%-var(--sidebar-width))] lg:pl-6 xl:pl-10 2xl:pl-12 [&_*:focus]:scroll-mt-[8rem] lg:[&_*:focus]:scroll-mt-[5rem]">
          <Outlet />
        </div>
      </div>
    </>
  );
}
