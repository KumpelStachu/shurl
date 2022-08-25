import { z } from 'zod'
import { createRouter } from '../createRouter'

export const userRouter = createRouter({ auth: true }) //
	.query('myShurls', {
		input: z
			.object({
				size: z.number().min(1).max(30).default(10),
				page: z.number().min(0).default(0),
			})
			.default({}),
		async resolve({ ctx, input }) {
			return ctx.prisma.shortUrl.findMany({
				orderBy: {
					createdAt: 'desc',
				},
				where: {
					userId: ctx.session!.user.id,
				},
				take: input.size,
				skip: input.size * input.page,
			})
		},
	})
