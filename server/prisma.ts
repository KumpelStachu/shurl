import { PrismaClient } from '@prisma/client'

declare global {
	var prisma: PrismaClient | undefined
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		errorFormat: 'minimal',
	})

prisma.$use(async (params, next) => {
	if (params.model === 'User' && params.action === 'create') {
		params.args.data.name ??= params.args.data.email
	}

	return next(params)
})

if (process.env.NODE_ENV === 'development') global.prisma = prisma
