import { AppRouter } from '@server/routers/_app'
import { createReactQueryHooks } from '@trpc/react'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { NextPageContext } from 'next'

export interface SSRContext extends NextPageContext {
	/**
	 * Set HTTP Status code
	 * @usage
	 * const utils = trpc.useContext();
	 * if (utils.ssrContext) {
	 *   utils.ssrContext.status = 404;
	 * }
	 */
	status?: number
}

export const trpc = createReactQueryHooks<AppRouter, SSRContext>()

export type inferQueryOutput<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureOutput<
	AppRouter['_def']['queries'][TRouteKey]
>

export type inferQueryInput<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureInput<
	AppRouter['_def']['queries'][TRouteKey]
>

export type inferMutationOutput<TRouteKey extends keyof AppRouter['_def']['mutations']> =
	inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>

export type inferMutationInput<TRouteKey extends keyof AppRouter['_def']['mutations']> = inferProcedureInput<
	AppRouter['_def']['mutations'][TRouteKey]
>
