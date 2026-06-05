import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
  site: 'https://jldec.me',
  trailingSlash: 'never',
  compressHTML: false,

  build: {
    format: 'file'
  },

  vite: {
    plugins: [tailwindcss()]
  },

  image: {},

  markdown: {
    shikiConfig: {
      theme: 'github-light-default'
    }
  },

  session: {
    driver: {
      entrypoint: new URL('./src/session/driver.ts', import.meta.url),
      config: {
        binding: 'SESSIONS',
        objectName: 'SESSIONS'
      }
    }
  },

  adapter: cloudflare({
    imageService: 'compile'
  })
})
