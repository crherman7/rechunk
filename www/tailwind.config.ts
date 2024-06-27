import type {Config} from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixelify: ['"Pixelify Sans Variable"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
