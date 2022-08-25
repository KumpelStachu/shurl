import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { Context } from './context'

type Meta = {
	auth?: boolean
}

export function createRouter(routerMeta: Meta = {}) {
	return trpc.router<Context, Meta>().middleware(async ({ meta, ctx, next }) => {
		meta = meta ? { ...routerMeta, ...meta } : routerMeta

		if (meta?.auth && !ctx.session?.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' })
		}

		return next()
	})
}
