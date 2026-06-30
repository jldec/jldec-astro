---
title: "Deploying your Astro v6 site on Cloudflare Workers"
date: 2026-05-23
layout: BlogPostLayout
splash:
  image: images/orangeflowers.webp
---
# Deploying your Astro v6 site on Cloudflare Workers

One of highlights of the [Astro v6 announcement](https://astro.build/blog/astro-6/) was an improved dev server built on Vite's environments API. This enables full integration with cloudflare workers both in dev and prod, making it easy to combine pre-rendered static assets and server-side logic in one Astro site.

One small gotcha is that the default assets configuration provided by `astro add cloudflare` still sends all requests which _don't_ match your prebuilt or public assets to the worker.

```jsonc
"assets": {
  "directory": "./dist",
  "binding": "ASSETS"
},
```

If you've ever run a public website, you quickly see a steady stream of junk requests for paths like `.php` files, `wp-admin`, and other vulnerability probes.

Workers are cheap, but there is no reason to run Worker code for requests that should just be handled as static assets.

## Worker first only where needed

In this site, server logic is only needed for `/sessions` and `/api/*`, so those are the only paths in `run_worker_first`:

```jsonc
"assets": {
  "directory": "dist",
  "not_found_handling": "404-page",
  "run_worker_first": ["/sessions", "/api/*"]
}
```

That means requests for blog posts, images, CSS, JS, and random non-existent probe paths are resolved by Cloudflare Assets without hitting the Worker runtime.

## Clean 404 handling for static misses

I also added a `404.astro` page so the build emits `404.html`. With `"not_found_handling": "404-page"`, Cloudflare serves that static page for asset misses.

The page is intentionally simple: an `<h2>404</h2>` and the missing URL shown underneath.

## Why this pattern works

This setup keeps costs and noise down, preserves dynamic behavior where needed, and gives predictable 404 behavior at the edge.

It's a small change, but it is one of those practical defaults that makes Astro + Cloudflare feel solid in production.
