import starlightPlugin from '@astrojs/starlight-tailwind';

// Generated color palettes
const accent = {200: '#bfc9d8', 600: '#526d95', 900: '#273344', 950: '#1d242f'};
const gray = {
  100: '#f5f6f8',
  200: '#eceef2',
  300: '#c0c2c7',
  400: '#888b96',
  500: '#545861',
  700: '#353841',
  800: '#24272f',
  900: '#17181c',
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
