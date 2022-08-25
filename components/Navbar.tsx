import { Button, Card, Container, Group, useMantineTheme } from '@mantine/core'
import { useElementSize, useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { IconClock, IconHandClick, IconPlus } from '@tabler/icons'
import { useRouter } from 'next/router'
import ClientOnly from './ClientOnly'
import NavbarUser from './NavbarUser'

export default function Navbar() {
	const { ref, height } = useElementSize()
	const router = useRouter()
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), true)
	const small = useMediaQuery(`(max-width: ${theme.breakpoints.sm / 2}px)`, false)

	return (
		<Container size="md" mt="md">
			<Card p="xs" radius="lg" shadow="md">
				<Group ref={ref} position={height > 36 ? 'center' : 'apart'} spacing={large ? 'xs' : 0}>
					<Button
						component={NextLink}
						href="/"
						variant={router.pathname === '/' ? 'light' : 'subtle'}
						leftIcon={<IconPlus size={20} />}
						px="sm"
					>
						new{large && ' shurl'}
					</Button>

					<Group spacing="xs">
						<Button
							component={NextLink}
							href="/top"
							variant={router.pathname === '/top' ? 'light' : 'subtle'}
							leftIcon={<IconHandClick size={20} />}
							px="sm"
							styles={{
								leftIcon: {
									marginRight: small ? 0 : undefined,
								},
							}}
						>
							{!small && 'top'}
							{large && ' shurls'}
						</Button>
						<Button
							component={NextLink}
							href="/recent"
							variant={router.pathname === '/recent' ? 'light' : 'subtle'}
							leftIcon={<IconClock size={20} />}
							px="sm"
							styles={{
								leftIcon: {
									marginRight: small ? 0 : undefined,
								},
							}}
						>
							{!small && 'recent'}
							{large && ' shurls'}
						</Button>
						<ClientOnly>
							<NavbarUser />
						</ClientOnly>
					</Group>
				</Group>
			</Card>
		</Container>
	)
}
