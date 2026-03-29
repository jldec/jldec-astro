---
title: Building a mimimal static site with Cloudflare Workers
layout: BlogPostLayout
splash:
  image: images/minimal-static-site.jldec.workers.dev.webp
date: 2024-09-27
---
# Building a minimal static site with Cloudflare Workers

Cloudflare recently announced [static assets](https://blog.cloudflare.com/builder-day-2024-announcements/#static-asset-hosting) for workers.

You can now deploy static files with a worker, instead of shipping worker code in your Cloudflare Pages project.

This makes it possible to add things like websockets using [durable objects](https://developers.cloudflare.com/durable-objects/) which are [not deployable](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix/) via Cloudflare Pages.

## DIY

Here are the steps to deploy a static site **from scratch**. You can follow along or find the code in [GitHub](https://github.com/jldec/minimal-static-site).

Less patient users can run `pnpm create cloudflare --experimental` and choose a static asset template as described in the [docs](https://developers.cloudflare.com/workers/static-assets/get-started/#1-create-a-new-worker-project-using-the-cli).

### 1. Create an empty directory and install wrangler
These instructions assume that you already have [node](https://nodejs.org/) and [pnpm](https://pnpm.io/).
```sh
mkdir minimal-static-site
cd minimal-static-site
pnpm install wrangler
```

### 2. Create wrangler.toml
You can choose your own worker name and content directory for assets.
```toml
#:schema node_modules/wrangler/config-schema.json
name = "minimal-static-site"
compatibility_date = "2024-09-25"
assets = { directory = "./content" }
```
The worker will serve all files in the assets directory on [routes](https://developers.cloudflare.com/workers/static-assets/routing/) starting at the worker root.

### 3. Create index.html in your content directory
Here is some sample HTML to get started. Use any [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) and [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) files you like. Everything in the content directory will be uploaded and served, including [images](https://developer.mozilla.org/en-US/docs/Web/Media/images).
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #255;
      }
      h1 {
        color: orange;
        font-size: 20vw;
        padding: 0.5ch;
      }
    </style>
  </head>
  <body>
    <h1>Hello👋 Workers</h1>
  </body>
</html>
```

### 4. Ship it 🚢

```txt
$ pnpm wrangler deploy

 ⛅️ wrangler 3.78.10
--------------------

🌀 Building list of assets...
🌀 Starting asset upload...
🌀 Found 1 new or modified file to upload. Proceeding with upload...
+ /index.html
Uploaded 1 of 1 assets
✨ Success! Uploaded 1 file (1.68 sec)

Total Upload: 0.34 KiB / gzip: 0.24 KiB
Uploaded minimal-static-site (9.81 sec)
Deployed minimal-static-site triggers (5.77 sec)
  https://minimal-static-site.jldec.workers.dev
Current Version ID: d0ecd041-b9a3-4e89-b168-baa394567839
```

The result is live at [minimal-static-site.jldec.workers.dev](https://minimal-static-site.jldec.workers.dev)

### What's next?
Here are some suggestions for next steps:
- Connect a [GitHub](https://developers.cloudflare.com/workers/ci-cd/builds/#get-started) repo.
- Add a [custom domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
- Build your site with a [framework](https://developers.cloudflare.com/workers/frameworks/) like [Astro](https://developers.cloudflare.com/workers/frameworks/framework-guides/astro/).

---
_For more thoughts about workers and assets, see [Read-write Static Assets bindings for Cloudflare Workers](read-write-static-asset-bindings-for-cloudflare-workers)._
