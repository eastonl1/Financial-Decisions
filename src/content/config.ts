import { defineCollection, z } from 'astro:content';

const insights = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		description: z.string().optional(),
		pdf: z.string().optional(),
		featuredImage: z.string().optional(),
	}),
});

const posts = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string().optional(),
		issue: z.string().optional(),
		date: z.coerce.date().optional(),
		description: z.string().optional(),
	}),
});

export const collections = {
	insights,
	posts,
};
