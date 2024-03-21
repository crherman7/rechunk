import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
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
      customCss: ['./src/tailwind.css'],
    }),
    tailwind({applyBaseStyles: false}),
  ],
});
