import dayjs from 'dayjs'
import { z } from 'zod'
import { createRouter } from '../createRouter'

export const userRouter = createRouter({ auth: true }) //
	.query('shurls', {
		input: z.object({
			size: z.number().optional(),
			page: z.number().min(0).default(0),
			search: z
				.object({
					url: z.string().default(''),
					alias: z.string().default(''),
					public: z.boolean().nullable().default(null),
					password: z.boolean().nullable().default(null),
					expires: z.date().nullable().array().length(2).default([null, null]),
					created: z.date().nullable().array().length(2).default([null, null]),
					sort: z
						.enum([
							'url asc',
							'url desc',
							'alias asc',
							'alias desc',
							'visits asc',
							'visits desc',
							'expires asc',
							'expires desc',
							'createdAt asc',
							'createdAt desc',
						])
						.default('createdAt desc'),
				})
				.default({}),
		}),
		async resolve({ ctx, input }) {
			const [orderBy, orderType] = input.search.sort.split(' ')
			return ctx.prisma.shortUrl.findMany({
				orderBy: {
					[orderBy]: orderType,
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
				skip: (input.size ?? 0) * input.page,
			})
		},
	})
