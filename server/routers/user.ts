import dayjs from 'dayjs'
import { z } from 'zod'
import { createRouter } from '../createRouter'

export const userRouter = createRouter({ auth: true }) //
	.query('shurls', {
		input: z
			.object({
				size: z.number().min(1).max(30).default(10),
				page: z.number().min(0).default(0),
				search: z
					.object({
						url: z.string().default(''),
						alias: z.string().default(''),
						public: z.boolean().nullable().default(null),
						password: z.boolean().nullable().default(null),
						expires: z.date().nullable().array().length(2).default([null, null]),
						created: z.date().nullable().array().length(2).default([null, null]),
					})
					.default({}),
			})
			.default({}),
		async resolve({ ctx, input }) {
			return ctx.prisma.shortUrl.findMany({
				orderBy: {
					createdAt: 'desc',
				},
				where: {
					userId: ctx.session!.user.id,
					url: {
						contains: input.search.alias,
					},
					alias: {
						contains: input.search.alias,
					},
					public: input.search.public ?? undefined,
					password: input.search.password ? { not: null } : input.search.password === null ? undefined : null,
					expires: {
						gt: input.search.expires[0] ?? undefined,
						lt: input.search.expires[1] ? dayjs(input.search.expires[1]).endOf('day').toDate() : undefined,
					},
					createdAt: {
						gt: input.search.created[0] ?? undefined,
						lt: input.search.created[1] ? dayjs(input.search.created[1]).endOf('day').toDate() : undefined,
					},
				},
				take: input.size,
				skip: input.size * input.page,
			})
		},
	})
