import starlightPlugin from '@astrojs/starlight-tailwind';

// Generated color palettes
const accent = {200: '#c8c8c8', 600: '#6b6b6b', 900: '#323232', 950: '#242424'};
const gray = {
  100: '#f6f6f6',
  200: '#edeeed',
  300: '#c2c2c1',
  400: '#8b8c8a',
  500: '#575857',
  700: '#383837',
  800: '#262726',
  900: '#181818',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {accent, gray},
    },
  },
  plugins: [starlightPlugin()],
};
