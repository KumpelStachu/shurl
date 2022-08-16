import { Button, Card, Container, Group } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { IconChecklist, IconClock, IconHandClick, IconPlus } from '@tabler/icons'
import { useRouter } from 'next/router'

export default function Navbar() {
	const { ref, height } = useElementSize()
	const router = useRouter()

	return (
		<Container size="md" mt="md">
			<Card p="xs" radius="lg">
				<Group ref={ref} position={height > 36 ? 'center' : 'apart'}>
					<Group position="center" spacing="xs">
						<Button
							component={NextLink}
							href="/"
							variant={router.pathname === '/' ? 'light' : 'subtle'}
							leftIcon={<IconPlus size={20} />}
						>
							create new shurl
						</Button>
						<Button
							component={NextLink}
							href="/todo"
							variant={router.pathname === '/todo' ? 'light' : 'subtle'}
							leftIcon={<IconChecklist size={20} />}
						>
							todo
						</Button>
					</Group>

					<Group position="center" spacing="xs">
						<Button
							component={NextLink}
							href="/top"
							variant={router.pathname === '/top' ? 'light' : 'subtle'}
							leftIcon={<IconHandClick size={20} />}
						>
							top shurls
						</Button>
						<Button
							component={NextLink}
							href="/recent"
							variant={router.pathname === '/recent' ? 'light' : 'subtle'}
							leftIcon={<IconClock size={20} />}
						>
							recent shurls
						</Button>
					</Group>
				</Group>
			</Card>
		</Container>
	)
}
