import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(201.4286, 30.4348%, 90.9804%)',
        foreground: 'hsl(210, 25%, 7.8431%)',
        // add other custom colors here if needed
      },
    },
  },
  plugins: [],
};

export default config;
