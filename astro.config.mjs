import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  site: 'https://aerrata.github.io',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  prefetch: {
    prefetchAll: true,
  },
  markdown: {
    shikiConfig: {
      theme: 'min-dark',
    },
  },
})
