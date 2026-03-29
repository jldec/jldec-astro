# jldec-astro

Static website built with [Astro v6](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/).

## Scripts

```
pnpm dev       # Start dev server
pnpm build     # Build static site to dist/
pnpm preview   # Preview the build locally
```

## Directory structure

```
content/            # Markdown content
  blog/             # Blog posts
  index.md          # Homepage
public/
  images/           # Static images
  js/               # Client-side scripts
src/
  components/       # Astro components
    icons/          # SVG icon components
  layouts/          # Page layouts
  pages/            # Routes
    blog/           # Blog list and [slug] pages
  styles/           # Global CSS (Tailwind)
  content.config.ts # Content collection definitions
```
