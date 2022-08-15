import ErrorHandler from '@components/ErrorHandler'
import Navbar from '@components/Navbar'
import { ColorScheme, ColorSchemeProvider, Container, MantineProvider } from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import { cache } from '@utils/cache'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: 'theme',
		defaultValue: 'dark',
		getInitialValueInEffect: true,
	})

	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

	useHotkeys([['mod+J', () => toggleColorScheme()]])

	return (
		<>
			<Head>
				<title>shurl</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>

			<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{ colorScheme, defaultRadius: 'md', primaryColor: 'yellow' }}
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
			</ColorSchemeProvider>
		</>
	)
}

export default MyApp
