import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  important: true,
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 1s infinite alternate'
      },
      keyframes: {
        pulse: {
          from: { transform: 'scale(0.9)' },
          to: { transform: 'scale(1.1)' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
