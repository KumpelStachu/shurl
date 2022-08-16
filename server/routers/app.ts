import { createRouter } from '../createRouter'
import { shurlRouter } from './shurl'
import superjson from 'superjson'

export const appRouter = createRouter()
	.transformer(superjson)
	/**
	 * Optionally do custom error (type safe!) formatting
	 * @link https://trpc.io/docs/error-formatting
	 */
	// .formatError(({ shape, error }) => { })
	.query('healthz', {
		async resolve() {
			return 'yay!'
		},
	})
	.merge('shurl.', shurlRouter)

export type AppRouter = typeof appRouter
