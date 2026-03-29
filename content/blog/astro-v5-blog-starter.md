---
title: "Astro v5 Blog starter"
date: 2024-12-27
layout: BlogPostLayout
splash:
  image: /images/big-ben.webp
---

# Astro v5 blog starter

I recently moved a friend's blog to [Astro v5](https://astro.build/blog/astro-5/). The motivation behind selecting Astro was its first-class support for markdown content.

With just a minimal amount of boilerplate, Astro will validate markdown frontmatter, generate static pages for each post, and optimize all the images in your posts.

> https://astro-v5-blog-starter.jldec.me/blog/first-post

### Markdown
![screenshot of blog post markdown](/images/astro-starter-markdown.webp)

### HTML
![screenshot of blog post HTML](/images/astro-starter-html.webp)

## Starter Repo
Here is the result of extracting these key features into a new blog starter. The repo does not include a lot of design - just the configuration and a minimal amount of code.

> https://github.com/jldec/astro-v5-blog-starter

The project includes:
- [Tailwind CSS](https://docs.astro.build/en/guides/integrations-guide/tailwind/) with [typography](https://docs.astro.build/en/recipes/tailwind-rendered-markdown/#setting-up-tailwindcsstypography)
- Image optimization with the [`<Image>`](https://docs.astro.build/en/guides/images/#display-optimized-images-with-the-image--component) component
- [Static](https://docs.astro.build/en/guides/content-collections/#building-for-static-output-default) builds (SSG) for Cloudflare Pages.

## File Structure
```
├── LICENSE
├── README.md
├── astro.config.mjs
├── package.json
├── public
│   ├── _headers
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── AstroLogo.astro
│   ├── content
│   │   ├── blog
│   │   │   ├── 2nd-post.md
│   │   │   └── first-post.md
│   │   └── images
│   │       ├── birch-trees.webp
│   │       └── sunset-cambridge.jpg
│   ├── content.config.ts
│   ├── layouts
│   │   └── Layout.astro
│   ├── pages
│   │   ├── 404.astro
│   │   ├── blog
│   │   │   └── [id].astro
│   │   └── index.astro
│   └── styles
│       └── global.css
├── tailwind.config.mjs
├── tsconfig.json
└── wrangler.toml
```

## Markdown driven blog
Markdown blog posts live in [src/content/blog](https://github.com/jldec/astro-v5-blog-starter/tree/main/src/content/blog).

The schema for the `blog` collection is defined in [content.config.ts](https://github.com/jldec/astro-v5-blog-starter/blob/main/src/content.config.ts). This file also includes utility functions for sorting and filtering posts. E.g. if the `draft` flag is set, a post will only be included during dev, but not published with the production build.

The home page is defined in [src/pages/index.astro](https://github.com/jldec/astro-v5-blog-starter/blob/main/src/pages/index.astro) which lists posts in date order.

Posts are rendered by the dynamic route [src/pages/blog/[id].astro](https://github.com/jldec/astro-v5-blog-starter/blob/main/src/pages/blog/%5Bid%5D.astro). In order for Astro to pre-render static pages, dynamic routes export a `getStaticPaths` function which returns a list of params and props for each rendered route.

### src/pages/blog/[id].astro
```tsx
---
import { Image } from 'astro:assets';
import { getCollection, render } from 'astro:content';
import { filterAllPosts } from '~/content.config';
import Layout from '~/layouts/Layout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', filterAllPosts);
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<Layout title={post.data.title}>
  <Image
    src={post.data.image.src}
    alt={post.data.image.alt || ''}
    class="w-full h-60 object-cover object-bottom"
  />
  <article class="prose mx-auto p-4">
    <h1>{post.data.title}</h1>
    <a href="/">&lt;&lt; Back</a>
    <Content />
  </article>
</Layout>
```

## Image optimization
A `src` path and `alt` text can be declared for images in markdown frontmatter, or inline in markdown.

These are passed into the `<Image>` component which inspects each image, and generates `<img>` tags with `width` and `height` attributes, thereby reducing layout shifts in the browser.

Images are converted to webp format, and stored in `dist/_astro` with unique (cacheable) names during the build process.

## Publishing on Cloudflare Pages
The [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) adapter is not needed for static sites.

Cloudflare Pages [matches routes](https://developers.cloudflare.com/pages/configuration/serving-pages/#route-matching) with `.html` files. To avoid trailing slashes, [configure](https://github.com/jldec/astro-v5-blog-starter/blob/main/astro.config.mjs#L8-L11) the build to generate `<route>.html` files instead of `<route>/index.html`.

The [_headers](https://github.com/jldec/astro-v5-blog-starter/blob/main/public/_headers) file adds cache control headers for immutable content.

## Conclusion
Astro v5 is a great choice for a markdown driven blog, as long as you're fine with doing occasional maintenance to update dependencies.

Here are some ideas for future improvements to this starter:

- Sitemap
- Menu component for desktop and mobile
- Nicer fonts
- Icons for social links

I hope you find this starter useful. Please reach out [on X](https://x.com/jldec) if you have any feedback or suggestions.