# AGENTS.md — jldec-astro

This site was ported from [RedwoodSDK (RSC)](https://github.com/jldec/jldec-website) to [Astro](https://astro.build/).
The following conventions were established during the port.

## Keep it simple

- Prefer Astro defaults over custom configuration. E.g. use the default fade transition from `<ClientRouter />` rather than custom `transition:name` or `transition:animate` directives.
- Don't use `transition:persist` on static components like menus — it's only needed for elements with client-side state.
- Avoid wrapping content in extra `div` elements for transitions; the router handles it.

## Images

- **Colocate images with content.** Blog images live in `content/blog/images/`, not `public/`.
  Only `favicon.jpg` stays in `public/` for stable browser discovery.
- **Use relative paths** in markdown and frontmatter (e.g. `images/foo.png`, not `/images/foo.png`).
  Astro's `image()` schema and markdown processor require relative paths to optimize images.
- **Never hardcode image imports** if the image is available from the content collection.
  Get splash images from frontmatter via the content collection API instead.
- **Use `<Image />` from `astro:assets`** with `loading="eager"` and `fetchpriority="high"` for splash/hero images (above the fold).
- Use `getImage()` from `astro:assets` to resolve optimized image URLs at build time for `<link rel="preload">` tags.
- Global image layout is set to `constrained` in `astro.config.mjs` — images scale down but never upscale.

## URLs and links

- Keep URLs in content as simple as possible — no `.html` extensions, no trailing slashes.
- `astro.config.mjs` uses `trailingSlash: 'never'` and `build.format: 'file'`.
- Canonical URLs strip `.html` extensions.

## Prefetching and preloading

- Use `<link rel="prefetch">` in `<head>` for likely next-page navigations (e.g. next/prev blog posts, `/blog` from home).
- Use `<link rel="preload" as="image">` for splash images on the next page, resolved at build time via `getImage()`.
- These are passed to `ContentLayout` via `prefetchLinks` and `preloadImages` props.

## Content schema

- Use the `image()` helper in `src/content.config.ts` for all image fields.
- Support both `splash.image` and `splashimage` frontmatter fields for backward compatibility.
- Don't use `.passthrough()` on schemas — it hides inconsistencies.

## Drafts

- Set `draft: true` in frontmatter to mark a blog post as a draft.
- Drafts are visible in dev mode but filtered out in production builds using `import.meta.env.PROD`.

## Build and deploy

- `sharp` is required as a dependency for build-time image optimization.
- `compressHTML: false` is set to preserve readable HTML output.
- Deployed as a static site on Cloudflare Workers (no adapter needed).
