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
            {label: 'Overview', link: '/rechunk/overview/overview/'},
            {label: 'Objectives', link: '/rechunk/overview/objectives/'},
            {label: 'How it works?', link: '/rechunk/overview/how-it-works/'},
          ],
        },
        {
          label: 'Guides',
          items: [
            {
              label: 'Getting Started',
              link: '/rechunk/guides/getting-started/',
            },
          ],
        },
        {
          label: 'Reference',
          items: [
            {
              label: 'Add Configuration',
              link: '/rechunk/reference/add-configuration/',
            },
            {label: 'Import Chunk', link: '/rechunk/reference/import-chunk/'},
          ],
        },
      ],
    }),
    tailwind({applyBaseStyles: false}),
  ],
  site: 'https://crherman7.github.io',
  base: 'rechunk',
});
