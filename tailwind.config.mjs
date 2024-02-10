const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist Sans', ...defaultTheme.fontFamily.sans],
        mono: ['Geist Mono', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        'spin-slowest': 'spin 30s linear infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              'word-wrap': 'break-word',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
