import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          muted: 'rgb(var(--accent-muted) / <alpha-value>)',
        },
      },
      boxShadow: {
        card: '0 1px 0 0 rgb(255 255 255 / 0.06), 0 12px 40px -12px rgb(0 0 0 / 0.55)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'app-mesh':
          'radial-gradient(1200px circle at 10% -10%, rgb(var(--accent) / 0.14), transparent 45%), radial-gradient(900px circle at 90% 0%, rgb(139 92 246 / 0.08), transparent 42%), linear-gradient(180deg, rgb(var(--surface) / 1) 0%, rgb(9 9 11) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
