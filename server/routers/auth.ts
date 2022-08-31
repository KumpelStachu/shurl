import { hash } from 'argon2'
import { z } from 'zod'
import { createRouter } from '../createRouter'

export const authRouter = createRouter()
	.query('session', {
		resolve({ ctx }) {
			return ctx.session
		},
	})
	.query('checkUsername', {
		input: z.string().trim().min(1).max(191),
		async resolve({ ctx, input }) {
			const user = await ctx.prisma.user.findFirst({
				where: {
					name: input,
				},
				select: {
					_count: true,
				},
			})

			return !user
		},
	})
	.query('checkEmail', {
		input: z.string().email(),
		async resolve({ ctx, input }) {
			const user = await ctx.prisma.user.findFirst({
				where: {
					email: input,
				},
				select: {
					_count: true,
				},
			})

			return !user
		},
	})
	.mutation('signUp', {
		input: z.object({
			email: z.string().email(),
			username: z.string(),
			password: z.string(),
		}),
		async resolve({ ctx, input }) {
			return ctx.prisma.account.create({
				data: {
					type: 'credentials',
					provider: 'credentials',
					providerAccountId: input.username,
					access_token: await hash(input.password),
					user: {
						create: {
							email: input.email,
							name: input.username,
						},
					},
				},
			})
		},
	})
