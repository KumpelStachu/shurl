import { ShortUrl } from '@prisma/client'
import { createRouter } from '@server/createRouter'
import { prisma } from '@server/prisma'
import { randomAlias, transformShurls } from '@utils/utils'
import { z } from 'zod'

export const shurlRouter = createRouter()
	.query('top', {
		async resolve() {
			const found = await prisma.shortUrl.findMany({
				orderBy: [{ visits: 'desc' }, { createdAt: 'asc' }],
				where: {
					public: true,
				},
				take: 10,
			})
			return transformShurls(found)
		},
	})
	.query('recent', {
		async resolve() {
			const found = await prisma.shortUrl.findMany({
				orderBy: {
					createdAt: 'desc',
				},
				where: {
					public: true,
				},
				take: 15,
			})
			return transformShurls(found)
		},
	})
	.mutation('checkPassword', {
		input: z.object({
			alias: z.string(),
			password: z.string(),
		}),
		async resolve({ input }) {
			return prisma.shortUrl.findFirstOrThrow({
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
		async resolve({ input: { usePassword, ...input } }) {
			const created = await prisma.shortUrl.create({
				data: { ...input, password: usePassword ? input.password : null },
			})
			return transformShurls([created])[0]
		},
	})
	.mutation('delete', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ input }) {
			const { id } = input
			await prisma.shortUrl.delete({ where: { id } })
			return {
				id,
			}
		},
	})
