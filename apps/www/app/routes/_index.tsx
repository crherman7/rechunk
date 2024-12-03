import {CaretRightIcon, ExternalLinkIcon} from '@radix-ui/react-icons';
import type {MetaFunction} from '@remix-run/node';
import {animate, stagger} from 'framer-motion';
import {useEffect} from 'react';

import {ButtonLink} from '~/components/ButtonLink';
import {Header} from '~/components/Header';
import {GridPattern} from '~/components/ui/grid-pattern';
import Iphone15Pro from '~/components/ui/iphone-15-pro';
import Safari from '~/components/ui/safari';
import {ShinyDiv} from '~/components/ui/shiny-div';
import * as Text from '~/components/ui/text';

export const meta: MetaFunction = () => {
  return [
    {title: 'ReChunk | Remote Chunks'},
    {
      name: 'description',
      content: 'Seamless Code Chunking for Optimized React Native Apps.',
    },
  ];
};

export default function Index() {
  useEffect(() => {
    animate('.animate-opacity', {opacity: 1}, {delay: stagger(0.2)});
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background Grid */}
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className="-z-10 [mask-image:radial-gradient(750px_circle_at_center,white,transparent)]"
      />

      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="mt-6 flex flex-col items-center px-6 py-6">
        <ShinyDiv className="animate-opacity mb-12 rounded-full opacity-0">
          <div className="flex flex-row items-center justify-center gap-3">
            <p>🎉</p>
            <div className="h-4 w-[0.1px] bg-gray-300" />
            <Text.Small className="text-xs font-light text-gray-500">
              Beta Coming Soon
            </Text.Small>
          </div>
        </ShinyDiv>
        <Text.H1 className="animate-opacity text-center opacity-0">
          Launch without limits.
        </Text.H1>
        <Text.P className="animate-opacity mt-6 max-w-2xl text-center font-thin opacity-0">
          Effortlessly bundle, sign, and serve code with blazing-fast
          performance and built-in security. Simplify your React Native
          app&apos;s lifecycle with modular delivery and dynamic updates that
          just work. Take control of your codebase. ReChunk it.
        </Text.P>

        {/* Call to Actions */}
        <div className="animate-opacity mt-6 flex flex-row justify-center gap-4 opacity-0">
          <ButtonLink
            to="/chunks"
            label="Get Started"
            icon={<CaretRightIcon className="size-5" />}
          />
          <ButtonLink
            to="https://crherman7.github.io/rechunk/"
            label="Docs"
            icon={<ExternalLinkIcon className="ml-2 size-4" />}
            external
          />
        </div>
      </main>

      {/* Visual Elements */}
      <div className="animate-opacity opacity-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 w-full">
          <Safari
            url="https://rechunk.xyz"
            src="/screenshot_browser.png"
            className="relative inset-y-[450px] mx-auto h-[100vh] w-[80vw] sm:inset-y-[500px] sm:h-[90vh]"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 w-full">
          <Iphone15Pro
            className="relative inset-x-[27vw] inset-y-[400px] mx-auto h-[100vh] w-[30vw] sm:inset-y-[450px]"
            src="/screenshot_mobile.png"
          />
        </div>
      </div>
    </div>
  );
}
