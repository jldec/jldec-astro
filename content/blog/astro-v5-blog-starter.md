---
title: "Astro v5 Blog starter"
date: 2024-12-27
layout: BlogPostLayout
splash:
  image: images/big-ben.webp
---

# Astro v5 blog starter

I recently moved a friend's blog to [Astro v5](https://astro.build/blog/astro-5/). The motivation behind selecting Astro was its first-class support for markdown content.

With just a minimal amount of boilerplate, Astro will validate markdown frontmatter, generate static pages for each post, and optimize all the images in your posts.

> https://astro-v5-blog-starter.jldec.me/blog/first-post

### Markdown
```md
---
date: '2024-12-01'
title: 'My First Blog Post'
image:
  src: '../images/birch-trees.webp'
---

## Markdown is

- a lightweight markup language
- for decorating plain text
- with things like headings, lists, links, and blockquotes
- making minimal assumptions about formatting.

#### Here is an inline image:

![sunset](../images/sunset-cambridge.jpg)
```

### HTML
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link
      rel="canonical"
      href="https://astro-v5-blog-starter.jldec.me/blog/first-post.html"
    />
    <meta name="generator" content="Astro v5.8.2" />
    <title>My First Blog Post</title>
    <link rel="stylesheet" href="/_astro/_id_.DVOqKcUa.css" />
  </head>
  <body>
    <img
      src="/_astro/birch-trees.DrRha0ED_9bfrU.webp"
      alt
      width="2016"
      height="955"
      loading="lazy"
      decoding="async"
      class="w-full h-60 object-cover object-bottom"
    />
    <div
      class="prose mx-auto"
    >
      <article>
        <h1>My First Blog Post</h1>
        <a href="/">&lt;&lt; Back</a>
        <h2 id="markdown-is">Markdown is</h2>
        <ul>
          <li>a lightweight markup language</li>
          <li>for decorating plain text</li>
          <li>with things like headings, lists, links, and blockquotes</li>
          <li>making minimal assumptions about formatting.</li>
        </ul>
        <h4 id="here-is-an-inline-image">Here is an inline image:</h4>
        <p>
          <img
            alt="sunset"
            width="1343"
            height="683"
            loading="lazy"
            decoding="async"
            src="/_astro/sunset-cambridge.7ZAluiBF_15WAVg.webp"
          />
        </p>
     </article>
    </div>
  </body>
</html>
```

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