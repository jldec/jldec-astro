import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

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
  image: {
    layout: 'constrained'
  },
  markdown: {
    shikiConfig: {
      theme: 'none'
    }
  }
})
