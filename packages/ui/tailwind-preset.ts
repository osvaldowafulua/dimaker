import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        surface: '#09090b',
        elevated: '#18181b',
        foreground: '#fafafa',
        muted: '#a1a1aa',
        border: '#27272a',
        accent: '#6366f1',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Inter',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
};

export default preset;
