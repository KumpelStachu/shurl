import { createRouter } from '@server/createRouter'
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
			url: z.string().min(1).url(),
			alias: z.string().min(1).max(32).default(randomAlias),
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

			const created = await ctx.prisma.shortUrl.create({
				data: {
					...input,
					password: usePassword ? input.password : null,
					userId: ctx.session?.user.id,
				},
			})
			return transformShurls([created], ctx.session?.user.id)[0]
		},
	})
	.mutation('delete', {
		meta: { auth: true },
		input: z.object({
			id: z.string(),
		}),
		async resolve({ ctx, input: { id } }) {
			await ctx.prisma.shortUrl.findFirstOrThrow({ where: { id, userId: ctx.session?.user.id } })

			await ctx.prisma.shortUrl.delete({ where: { id } })
			return {
				id,
			}
		},
	})
