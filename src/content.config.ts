import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      date: z.coerce.date().optional(),
      layout: z.string().optional(),
      splash: z
        .object({
          image: image().optional()
        })
        .optional(),
      splashimage: image().optional(),
      excerpt: z.string().optional(),
      draft: z.boolean().optional(),
      sortby: z.string().optional(),
      name: z.string().optional(),
      image: z.string().optional(),
      description: z.string().optional()
    })
})

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      siteurl: z.string().optional(),
      description: z.string().optional(),
      twitter: z.string().optional(),
      splash: z
        .object({
          image: image().optional()
        })
        .nullable()
        .optional(),
      navlinks: z
        .array(
          z.object({
            text: z.string(),
            href: z.string(),
            icon: z.string().optional()
          })
        )
        .optional(),
      sociallinks: z
        .array(
          z.object({
            text: z.string(),
            href: z.string(),
            icon: z.string().optional()
          })
        )
        .optional()
    })
})

export const collections = { blog, pages }
