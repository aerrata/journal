import { z, defineCollection } from 'astro:content'

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()),
    image: z.string().nullable().optional(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
})

export const collections = { posts }
