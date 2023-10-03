
import { defineCollection, z } from 'astro:content'

const demoCollection = defineCollection({
  type: 'content', schema: z.object({
    title: z.string(),
    context: z.string(),
    tags: z.array(z.string())
  })
})

export const collection = {
  'demo-collection': demoCollection
}