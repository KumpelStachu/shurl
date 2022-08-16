import ErrorHandler from '@components/ErrorHandler'
import Navbar from '@components/Navbar'
import { Container, MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { AppRouter } from '@server/routers/app'
import { withTRPC } from '@trpc/next'
import { cache } from '@utils/cache'
import { getBaseUrl } from '@utils/utils'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import superjson from 'superjson'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { SSRContext } from '@utils/trpc'
import { RouterTransition } from '@components/RouterTransition'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<meta name="description" content="shurl - url shortener" />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{ colorScheme: 'dark', defaultRadius: 'md', primaryColor: 'yellow' }}
				emotionCache={cache}
			>
				<RouterTransition />
				<NotificationsProvider position="top-right">
					<ErrorHandler />

					<Navbar />
					<Container size="sm" my="lg">
						<Component {...pageProps} />
					</Container>
				</NotificationsProvider>
			</MantineProvider>
		</>
	)
}

export default withTRPC<AppRouter>({
	config: () => ({
		transformer: superjson,
		links: [
			loggerLink({
				enabled: opts =>
					// process.env.NODE_ENV === 'development' ||
					opts.direction === 'down' && opts.result instanceof Error,
			}),
			httpBatchLink({
				url: `${getBaseUrl()}/api/trpc`,
			}),
		],
	}),
	ssr: true,
	responseMeta(opts) {
		const ctx = opts.ctx as SSRContext

		if (ctx.status) {
			return {
				status: ctx.status,
			}
		}

		const error = opts.clientErrors[0]
		if (error) {
			return {
				status: error.data?.httpStatus ?? 500,
			}
		}

		return {}
	},
})(MyApp)
