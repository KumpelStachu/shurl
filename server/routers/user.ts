import dayjs from 'dayjs'
import { z } from 'zod'
import { createRouter } from '../createRouter'

export const userRouter = createRouter({ auth: true })
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
	.query('providers', {
		async resolve({ ctx }) {
			const accounts = await ctx.prisma.account.findMany({
				where: {
					userId: ctx.session!.user.id,
				},
			})

			return accounts.map(a => a.provider)
		},
	})
	.mutation('unlinkAccount', {
		input: z.string(),
		async resolve({ ctx, input }) {
			const account = await ctx.prisma.account.findFirstOrThrow({
				where: {
					userId: ctx.session!.user.id,
					provider: input,
				},
			})

			return ctx.prisma.account.delete({
				where: {
					id: account.id,
				},
			})
		},
	})
	.mutation('unlinkShurls', {
		async resolve({ ctx }) {
			return ctx.prisma.shortUrl.updateMany({
				data: {
					userId: null,
				},
				where: {
					userId: ctx.session!.user.id,
				},
			})
		},
	})
	.mutation('deleteShurls', {
		async resolve({ ctx }) {
			return ctx.prisma.shortUrl.deleteMany({
				where: {
					userId: ctx.session!.user.id,
				},
			})
		},
	})
	.mutation('deleteAccount', {
		async resolve({ ctx }) {
			return ctx.prisma.user.delete({
				where: {
					id: ctx.session!.user.id,
				},
			})
		},
	})
	.mutation('updateAccount', {
		input: z.object({
			email: z.string().email().or(z.literal('')),
			name: z.string().min(1),
			image: z.string().url().or(z.literal('')),
		}),
		async resolve({ ctx, input }) {
			return ctx.prisma.user.update({
				data: {
					email: input.email || null,
					image: input.image || null,
					name: input.name,
				},
				where: {
					id: ctx.session!.user.id,
				},
			})
		},
	})
