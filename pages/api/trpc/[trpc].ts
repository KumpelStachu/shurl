import { createContext } from '@server/context'
import { appRouter } from '@server/routers/app'
import * as trpcNext from '@trpc/server/adapters/next'

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
	onError({ error }) {
		console.table(error)
		if (error.code === 'INTERNAL_SERVER_ERROR') {
			console.error('Something went wrong', error)
		}
	},
	batching: {
		enabled: true,
	},
})
