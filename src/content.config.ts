import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		image: z.string().optional(),
		featured: z.boolean().optional().default(false),
		draft: z.boolean().optional().default(false),
		readingTime: z.string(),
		pdfPath: z.string().optional(),
		issueItems: z.array(z.string()).optional(),
	}),
});

export const collections = { blog };
