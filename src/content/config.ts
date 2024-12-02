import { defineCollection, z } from "astro:content";
import { readFile } from "node:fs/promises";

const postsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      postTitle: z.string(),
      focusKeyphrase: z.string().optional(),
      datePublished: z.date(),
      lastUpdated: z.date(),
      seoMetaDescription: z.string(),
      featuredImage: image().optional(),
      featuredImageAlt: z.string(),
      ogImage: z.string().optional(),
      ogSquareImage: z.string().optional(),
      categories: z.string().array(),
      tags: z.string().array(),
    }),
});

export const collections = {
  posts: postsCollection,
};