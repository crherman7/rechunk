import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import {defineConfig} from 'astro/config';

export default defineConfig({
  integrations: [
    starlight({
      customCss: [
        './src/tailwind.css',
        '@fontsource-variable/inter',
        '@fontsource-variable/pixelify-sans',
      ],
      favicon: 'favicon.ico',
      title: 'ReChunk',
      social: {
        discord: 'https://discord.gg/xFhuxjwhss',
        github: 'https://github.com/crherman7/rechunk',
      },
      sidebar: [
        {
          label: 'Overview',
          items: [
            {label: 'Motivation', link: '/overview/motivation/'},
            {label: 'How it works', link: '/overview/how-it-works/'},
          ],
        },
        {
          label: 'Guides',
          items: [
            {label: 'Try it out', link: '/guides/try-it-out/'},
            {
              label: 'Getting Started',
              link: '/guides/getting-started/',
            },
          ],
        },
        {
          label: 'References',
          items: [
            {label: 'Command-line Interface', link: '/references/cli/'},
            {
              label: 'Client',
              link: '/references/client/',
            },
            {
              label: 'Server',
              link: '/references/server/',
            },
          ],
        },
      ],
    }),
    tailwind({applyBaseStyles: false}),
  ],
  site: 'https://crherman7.github.io',
  base: 'rechunk',
});
