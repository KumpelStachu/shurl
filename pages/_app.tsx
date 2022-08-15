import ErrorHandler from '@components/ErrorHandler'
import Navbar from '@components/Navbar'
import { Container, MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { cache } from '@utils/cache'
import type { AppProps } from 'next/app'
import Head from 'next/head'

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

export default MyApp
