---
title: "Deploying your Astro v6 site on Cloudflare Workers"
date: 2026-05-23
layout: BlogPostLayout
splash:
  image: images/orangeflowers.webp
---


If you've ever set up a public HTTP website, you'll know that inevitably you'll see a lot of spammy requests for .php or wp-admin or other probes looking for server vulnerabilties.

- Astro v6 [announcement](https://astro.build/blog/astro-6/)
- mention [Astro v5 blog starter](astro-v5-blog-starter) 

##  worker first vs. assets first
- even though workers are serverless, and very cheap, you don't want to serve junk requests
- restrict routes for workers
- serve assets with automatic not found handling
- 

