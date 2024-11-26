import { z, defineCollection } from 'astro:content'

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image().nullable(),
      tags: z.array(z.string()).optional().default([]),
      createdDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().optional().default(true),
    }),
  // schema: z.object({
  //   title: z.string(),
  //   description: z.string().optional(),
  //   tags: z.array(z.string()),
  //   image: z.string().nullable().optional(),
  //   createdDate: z.coerce.date(),
  //   updatedDate: z.coerce.date().optional(),
  // }),
})

export const collections = { posts }
