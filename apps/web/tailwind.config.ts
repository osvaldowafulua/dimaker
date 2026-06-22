import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#000000',
        background: '#000000',
        elevated: '#141414',
        card: {
          DEFAULT: '#1a1a1a',
          foreground: '#fafafa',
        },
        foreground: '#fafafa',
        muted: '#a3a3a3',
        'muted-surface': '#262626',
        primary: {
          DEFAULT: '#fafafa',
          foreground: '#0a0a0a',
        },
        subtle: '#737373',
        border: '#262626',
        input: '#262626',
        ring: '#525252',
        accent: '#ef4444',
        'accent-green': '#22c55e',
        'designali-lime': '#adfa1d',
        ali: '#ef4444',
        highlight: {
          DEFAULT: '#262626',
          foreground: '#fafafa',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,0.06)',
      },
    },
  },
};

export default config;
