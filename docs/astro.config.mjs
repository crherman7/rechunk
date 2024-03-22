import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      customCss: [
        './src/tailwind.css',
        '@fontsource/birthstone/400.css',
        '@fontsource-variable/source-code-pro/wght.css',
      ],
      favicon: 'favicon.ico',
      title: 'ReChunk',
      social: {
        github: 'https://github.com/crherman7/rechunk',
      },
      sidebar: [
        {
          label: 'Overview',
          items: [
            {label: 'Overview', link: '/overview/overview/'},
            {label: 'Objectives', link: '/overview/objectives/'},
            {label: 'How it works?', link: '/overview/how-it-works/'},
          ],
        },
        {
          label: 'Guides',
          items: [
            {
              label: 'Getting Started',
              link: '/guides/getting-started/',
            },
          ],
        },
        {
          label: 'Reference',
          items: [
            {
              label: 'Add Configuration',
              link: '/reference/add-configuration/',
            },
            {label: 'Import Chunk', link: '/reference/import-chunk/'},
          ],
        },
      ],
    }),
    tailwind({applyBaseStyles: false}),
  ],
  site: 'https://crherman7.github.io',
  base: 'rechunk',
});
