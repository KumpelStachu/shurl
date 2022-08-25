import { inferAsyncReturnType } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { prisma } from '@server/prisma'
import { unstable_getServerSession } from 'next-auth'
import { nextAuthOptions } from '@pages/api/auth/[...nextauth]'

export type Context = inferAsyncReturnType<typeof createContext>

export async function createContext({ req, res }: CreateNextContextOptions) {
	// for API-response caching see https://trpc.io/docs/caching

	const session = await unstable_getServerSession(req, res, nextAuthOptions)

	return {
		req,
		res,
		session,
		prisma,
	}
}
