import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

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
            {label: 'Overview', link: '/overview/overview/'},
            {label: 'How it works', link: '/overview/how-it-works/'},
          ],
        },
        {
          label: 'Guides',
          items: [
            {
              label: 'Getting Started',
              link: '/guides/getting-started/',
            },
            {
              label: 'Chunks',
              link: '/guides/chunks',
            },
            {
              label: 'Hosting',
              link: '/guides/hosting',
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
