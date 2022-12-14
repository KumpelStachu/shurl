import { createRouter } from '@server/createRouter'
import { TRPCError } from '@trpc/server'
import { randomAlias, transformShurls } from '@utils/utils'
import { z } from 'zod'

export const shurlRouter = createRouter()
	.query('top', {
		async resolve({ ctx }) {
			const found = await ctx.prisma.shortUrl.findMany({
				orderBy: [{ visits: 'desc' }, { createdAt: 'asc' }],
				where: {
					public: true,
				},
				take: 10,
			})
			return transformShurls(found, ctx.session?.user.id)
		},
	})
	.query('recent', {
		async resolve({ ctx }) {
			const found = await ctx.prisma.shortUrl.findMany({
				orderBy: {
					createdAt: 'desc',
				},
				where: {
					public: true,
				},
				take: 15,
			})
			return transformShurls(found, ctx.session?.user.id)
		},
	})
	.mutation('checkPassword', {
		input: z.object({
			alias: z.string(),
			password: z.string(),
		}),
		async resolve({ ctx, input }) {
			return ctx.prisma.shortUrl.findFirstOrThrow({
				where: input,
				select: {
					url: true,
				},
			})
		},
	})
	.mutation('create', {
		input: z.object({
			url: z.string().url(),
			alias: z.string().min(1).max(191).default(randomAlias),
			expires: z.date().min(new Date()).nullable(),
			public: z.boolean(),
			usePassword: z.boolean(),
			password: z.string().nullable(),
		}),
		async resolve({ ctx, input: { usePassword, ...input } }) {
			if (!ctx.session) {
				input.password = null
				input.expires = null
			}

			return ctx.prisma.shortUrl.create({
				data: {
					...input,
					password: usePassword ? input.password : null,
					userId: ctx.session?.user.id,
				},
			})
		},
	})
	.mutation('edit', {
		meta: { auth: true },
		input: z.object({
			id: z.string(),
			url: z.string().url().optional(),
			alias: z.string().min(1).max(191).optional(),
			expires: z.date().nullable().optional(),
			public: z.boolean().optional(),
			usePassword: z.boolean().default(true),
			password: z.string().nullable().optional(),
		}),
		async resolve({ ctx, input: { id, usePassword, ...input } }) {
			const shurl = await ctx.prisma.shortUrl.findFirst({ where: { id, userId: ctx.session!.user.id } })
			if (!shurl) throw new TRPCError({ code: 'UNAUTHORIZED' })

			return ctx.prisma.shortUrl.update({
				where: { id },
				data: {
					...input,
					password: usePassword ? input.password : null,
				},
			})
		},
	})
	.mutation('delete', {
		meta: { auth: true },
		input: z.string(),
		async resolve({ ctx, input: id }) {
			const shurl = await ctx.prisma.shortUrl.findFirst({ where: { id, userId: ctx.session!.user.id } })
			if (!shurl) throw new TRPCError({ code: 'UNAUTHORIZED' })

			return ctx.prisma.shortUrl.delete({ where: { id } })
		},
	})
