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
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {label: 'Example Guide', link: '/guides/example/'},
          ],
        },
        {
          label: 'Reference',
          autogenerate: {directory: 'reference'},
        },
      ],
    }),
    tailwind({applyBaseStyles: false}),
  ],
});
