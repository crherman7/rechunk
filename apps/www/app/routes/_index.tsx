import type {MetaFunction} from '@remix-run/node';
import {CaretRightIcon, ExternalLinkIcon} from '@radix-ui/react-icons';
import {animate, stagger} from 'framer-motion';

import {Header} from '~/components/Header';
import {GridPattern} from '~/components/ui/grid-pattern';
import Iphone15Pro from '~/components/ui/iphone-15-pro';
import Safari from '~/components/ui/safari';
import * as Text from '~/components/ui/text';
import {ShinyDiv} from '~/components/ui/shiny-div';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import {useEffect} from 'react';
import {ButtonLink} from '~/components/ButtonLink';

export const meta: MetaFunction = () => {
  return [
    {title: 'ReChunk | Remote Chunks'},
    {name: 'description', content: 'Welcome to ReChunk!'},
  ];
};

export default function Index() {
  useEffect(() => {
    animate('.animate-opacity', {opacity: 1}, {delay: stagger(0.2)});
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className="[mask-image:radial-gradient(750px_circle_at_center,white,transparent)] -z-10"
      />

      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center px-6 py-6 mt-6">
        <ShinyDiv className="mb-12 rounded-full opacity-0 animate-opacity">
          <div className="flex flex-row justify-center items-center gap-3">
            <p>🎉</p>
            <div className="h-4 w-[0.1px] bg-gray-300" />
            <Text.Small className="text-gray-500 font-light text-xs">
              Beta Coming Soon
            </Text.Small>
          </div>
        </ShinyDiv>
        <Text.H1 className="text-center opacity-0 animate-opacity">
          Launch without limits.
        </Text.H1>
        <Text.P className="text-center font-thin mt-6 max-w-2xl opacity-0 animate-opacity">
          Effortlessly bundle, sign, and serve code with blazing-fast
          performance and built-in security. Simplify your React Native
          app&apos;s lifecycle with modular delivery and dynamic updates that
          just work. Take control of your codebase. ReChunk it.
        </Text.P>

        {/* Call to Actions */}
        <div className="flex flex-row gap-4 justify-center mt-6 opacity-0 animate-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ButtonLink
                  to="/chunks"
                  label="Get Started"
                  icon={<CaretRightIcon className="size-5" />}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming Soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ButtonLink
            to="https://crherman7.github.io/rechunk/"
            label="Docs"
            icon={<ExternalLinkIcon className="size-4 ml-2" />}
            external
          />
        </div>
      </main>

      {/* Visual Elements */}
      <div className="opacity-0 animate-opacity">
        <div
          aria-hidden="true"
          className="absolute w-full bottom-0 pointer-events-none">
          <Safari
            url="https://rechunk.xyz"
            className="mx-auto relative w-[80vw] h-[100vh] inset-y-[450px] sm:h-[90vh] sm:inset-y-[500px]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute w-full bottom-0 pointer-events-none">
          <Iphone15Pro
            className="mx-auto relative w-[30vw] h-[100vh] inset-y-[400px] inset-x-[27vw] sm:inset-y-[450px]"
            src="/screenshot.png"
          />
        </div>
      </div>
    </div>
  );
}
