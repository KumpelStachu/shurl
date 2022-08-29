import ErrorHandler from '@components/ErrorHandler'
import Navbar from '@components/Navbar'
import { RouterTransition } from '@components/RouterTransition'
import { ColorScheme, ColorSchemeProvider, Container, MantineProvider } from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import { AppRouter } from '@server/routers/_app'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { cache } from '@utils/cache'
import { SSRContext } from '@utils/trpc'
import { getBaseUrl } from '@utils/utils'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import superjson from 'superjson'
import { ModalsProvider } from '@mantine/modals'
import DeleteShurlModal from '@components/modals/DeleteShurlModal'
import EditShurlModal from '@components/modals/EditShurlModal'

const ReactQueryDevtools =
	process.env.NODE_ENV === 'development' &&
	dynamic(async () => (await import('react-query/devtools')).ReactQueryDevtools)

function MyApp({ Component, pageProps }: AppProps) {
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: 'theme',
		defaultValue: 'dark',
	})

	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

	useHotkeys([['mod+J', () => toggleColorScheme()]])

	return (
		<>
			<Head>
				<title>shurl</title>
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<meta name="description" content="shurl - url shortener" />
			</Head>

			<SessionProvider session={pageProps.session}>
				<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
					<MantineProvider
						withGlobalStyles
						withNormalizeCSS
						theme={{
							colorScheme: colorScheme,
							defaultRadius: 'md',
							primaryColor: colorScheme === 'dark' ? 'yellow' : 'red',
						}}
						emotionCache={cache}
					>
						<RouterTransition />
						<NotificationsProvider position="top-right">
							<ModalsProvider
								modalProps={{ overlayBlur: 2 }}
								modals={{
									editShurl: EditShurlModal,
									deleteShurl: DeleteShurlModal,
								}}
							>
								<ErrorHandler />

								<Navbar />
								<Container size="sm" py="lg">
									<Component {...pageProps} />
								</Container>
							</ModalsProvider>
						</NotificationsProvider>
					</MantineProvider>
				</ColorSchemeProvider>
			</SessionProvider>

			{ReactQueryDevtools && <ReactQueryDevtools />}
		</>
	)
}

export default withTRPC<AppRouter>({
	config: () => ({
		transformer: superjson,
		url: `${getBaseUrl()}/api/trpc`,
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
